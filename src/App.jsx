import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    location: '',
    day: '',
    numberOfApplications: '',
    totalLoanValue: '',
    firstName: '',
    lastName: '',
  })
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState({
    totalEntries: 0,
    totalApplications: 0,
    totalLoanValue: 0,
    totalLoanValueFormatted: '0.00',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return (
      formData.location &&
      formData.day &&
      formData.firstName &&
      formData.lastName &&
      formData.numberOfApplications !== '' &&
      formData.totalLoanValue !== ''
    )
  }, [formData])

  useEffect(() => {
    let cancelled = false

    async function loadEntries() {
      try {
        const response = await fetch('/api/loan-entries')
        if (!response.ok) {
          throw new Error('Unable to fetch entries.')
        }

        const data = await response.json()
        if (!cancelled) {
          setEntries(data.entries)
          setSummary(data.summary)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEntries()

    return () => {
      cancelled = true
    }
  }, [])

  function onFieldChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function onSubmit(event) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = {
        location: formData.location,
        day: formData.day,
        numberOfApplications: Number(formData.numberOfApplications),
        totalLoanValue: Number(formData.totalLoanValue),
        firstName: formData.firstName,
        lastName: formData.lastName,
      }

      const response = await fetch('/api/loan-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.message || 'Unable to submit entry.')
      }

      const data = await response.json()
      setEntries((current) => [data.entry, ...current])
      setSummary(data.summary)
      setFormData({
        location: '',
        day: '',
        numberOfApplications: '',
        totalLoanValue: '',
        firstName: '',
        lastName: '',
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const exportUrl = '/api/loan-entries/export'

  return (
    <main className="page">
      <header className="page-header">
        <h1>Loan Activity Tracker</h1>
        <p>
          Enter daily loan activity by agent and export an Excel report for backend
          reporting.
        </p>
      </header>

      <section className="card summary-grid" aria-label="Portfolio summary">
        <article>
          <h2>Total records</h2>
          <p>{summary.totalEntries}</p>
        </article>
        <article>
          <h2>Total applications</h2>
          <p>{summary.totalApplications}</p>
        </article>
        <article>
          <h2>Total loan value</h2>
          <p>${summary.totalLoanValueFormatted}</p>
        </article>
      </section>

      <section className="card">
        <h2>New loan entry</h2>
        <form className="entry-form" onSubmit={onSubmit}>
          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={onFieldChange}
              placeholder="Johannesburg"
              required
            />
          </label>
          <label>
            Day
            <input
              name="day"
              type="date"
              value={formData.day}
              onChange={onFieldChange}
              required
            />
          </label>
          <label>
            Number of applications
            <input
              name="numberOfApplications"
              type="number"
              min="0"
              value={formData.numberOfApplications}
              onChange={onFieldChange}
              placeholder="8"
              required
            />
          </label>
          <label>
            Total value of loans
            <input
              name="totalLoanValue"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalLoanValue}
              onChange={onFieldChange}
              placeholder="125000.00"
              required
            />
          </label>
          <label>
            First name
            <input
              name="firstName"
              value={formData.firstName}
              onChange={onFieldChange}
              placeholder="Anele"
              required
            />
          </label>
          <label>
            Last name
            <input
              name="lastName"
              value={formData.lastName}
              onChange={onFieldChange}
              placeholder="Nkosi"
              required
            />
          </label>
          <button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Saving...' : 'Save entry'}
          </button>
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Submitted loan entries</h2>
          <a className="button-link" href={exportUrl}>
            Export to Excel
          </a>
        </div>

        {loading ? (
          <p>Loading entries...</p>
        ) : entries.length === 0 ? (
          <p>No entries yet. Add your first loan activity above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Location</th>
                  <th>Day</th>
                  <th>Applications</th>
                  <th>Total value</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {entry.firstName} {entry.lastName}
                    </td>
                    <td>{entry.location}</td>
                    <td>{entry.day}</td>
                    <td>{entry.numberOfApplications}</td>
                    <td>
                      $
                      {entry.totalLoanValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
