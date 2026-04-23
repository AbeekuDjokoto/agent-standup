import cors from 'cors'
import ExcelJS from 'exceljs'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFilePath = path.resolve(__dirname, '../data/loan-applications.json')
const app = express()
const port = Number(process.env.PORT) || 8787

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function summarize(entries) {
  const totalApplications = entries.reduce(
    (sum, entry) => sum + entry.numberOfApplications,
    0,
  )
  const totalLoanValue = entries.reduce((sum, entry) => sum + entry.totalLoanValue, 0)

  return {
    totalEntries: entries.length,
    totalApplications,
    totalLoanValue,
    totalLoanValueFormatted: numberFormatter.format(totalLoanValue),
  }
}

function normalizePayload(payload = {}) {
  const location = String(payload.location ?? '').trim()
  const day = String(payload.day ?? '').trim()
  const firstName = String(payload.firstName ?? '').trim()
  const lastName = String(payload.lastName ?? '').trim()
  const numberOfApplications = Number(payload.numberOfApplications)
  const totalLoanValue = Number(payload.totalLoanValue)

  if (!location || !day || !firstName || !lastName) {
    throw new Error('Location, day, first name, and last name are required.')
  }
  if (!Number.isFinite(numberOfApplications) || numberOfApplications < 0) {
    throw new Error('Number of applications must be a valid non-negative number.')
  }
  if (!Number.isFinite(totalLoanValue) || totalLoanValue < 0) {
    throw new Error('Total value of loans must be a valid non-negative number.')
  }

  return {
    location,
    day,
    firstName,
    lastName,
    numberOfApplications: Math.round(numberOfApplications),
    totalLoanValue,
  }
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })

  try {
    await fs.access(dataFilePath)
  } catch {
    await fs.writeFile(dataFilePath, '[]\n', 'utf8')
  }
}

async function readEntries() {
  await ensureDataFile()
  const raw = await fs.readFile(dataFilePath, 'utf8')

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeEntries(entries) {
  await fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2), 'utf8')
}

async function buildWorkbook(entries) {
  const workbook = new ExcelJS.Workbook()

  const entrySheet = workbook.addWorksheet('Loan Entries')
  entrySheet.columns = [
    { header: 'Created At', key: 'createdAt', width: 24 },
    { header: 'Location', key: 'location', width: 20 },
    { header: 'Day', key: 'day', width: 18 },
    { header: 'First Name', key: 'firstName', width: 18 },
    { header: 'Last Name', key: 'lastName', width: 18 },
    { header: 'Number of Applications', key: 'numberOfApplications', width: 24 },
    { header: 'Total Value of Loans', key: 'totalLoanValue', width: 20 },
  ]

  for (const entry of entries) {
    entrySheet.addRow(entry)
  }

  entrySheet.getColumn('totalLoanValue').numFmt = '#,##0.00'
  entrySheet.getRow(1).font = { bold: true }

  const summary = summarize(entries)
  const summarySheet = workbook.addWorksheet('Summary')
  summarySheet.addRows([
    ['Metric', 'Value'],
    ['Total Entries', summary.totalEntries],
    ['Total Applications', summary.totalApplications],
    ['Total Loan Value', summary.totalLoanValue],
  ])
  summarySheet.getRow(1).font = { bold: true }
  summarySheet.getColumn(1).width = 28
  summarySheet.getColumn(2).width = 18
  summarySheet.getCell('B4').numFmt = '#,##0.00'

  return workbook
}

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/loan-entries', async (_req, res) => {
  const entries = await readEntries()
  res.json({
    entries,
    summary: summarize(entries),
  })
})

app.post('/api/loan-entries', async (req, res) => {
  try {
    const normalized = normalizePayload(req.body)
    const entries = await readEntries()
    const createdAt = new Date().toISOString()
    const record = { ...normalized, id: randomUUID(), createdAt }

    entries.unshift(record)
    await writeEntries(entries)

    res.status(201).json({
      entry: record,
      summary: summarize(entries),
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/loan-entries/export', async (_req, res) => {
  const entries = await readEntries()
  const workbook = await buildWorkbook(entries)
  const date = new Date().toISOString().slice(0, 10)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="loan-report-${date}.xlsx"`,
  )

  await workbook.xlsx.write(res)
  res.end()
})

app.listen(port, () => {
  console.log(`Loan tracker backend running on http://localhost:${port}`)
})
