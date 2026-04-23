import { useMemo, useState } from 'react'
import './App.css'
import { postAgentRecord } from './services/agentService'

const LOCATION_OPTIONS = [
  'Accra - 1',
  'Accra - 2',
  'Kumasi - 1',
  'Kumasi - 2',
  'Cape Coast',
  'Ho',
  'Koforidua',
  'Tamale',
  'Suyani',
]

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    applicationsCount: '',
    totalAmount: '',
    location: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const canSubmit = useMemo(() => {
    const count = Number(formData.applicationsCount)
    const totalAmount = Number(formData.totalAmount)
    return (
      formData.fullName.trim() &&
      Number.isInteger(count) &&
      count >= 0 &&
      Number.isFinite(totalAmount) &&
      totalAmount >= 0 &&
      formData.location.length > 0
    )
  }, [formData])

  function onFieldChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function onLocationChange(event) {
    const { value, checked } = event.target
    setFormData((previous) => ({
      ...previous,
      location: checked
        ? [...previous.location, value]
        : previous.location.filter((item) => item !== value),
    }))
  }

  async function onSubmit(event) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        applicationsCount: Number(formData.applicationsCount),
        totalAmount: Number(formData.totalAmount),
        location: formData.location,
        createdAt: new Date().toISOString(),
      }
      await postAgentRecord(payload)
      setFormData({
        fullName: '',
        applicationsCount: '',
        totalAmount: '',
        location: [],
      })
      setSuccessMessage('Record saved successfully.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>New Application Record</h1>
        <p>
          Fill the required inputs and save them to Firebase.
        </p>
      </header>

      <section className="card">
        <h2>Application Inputs</h2>
        <form className="entry-form" onSubmit={onSubmit}>
          <label>
            Full name
            <input
              name="fullName"
              value={formData.fullName}
              onChange={onFieldChange}
              placeholder="Abeeku Djokoto"
              required
            />
          </label>
          <label>
            Applications count
            <input
              name="applicationsCount"
              type="number"
              min="0"
              step="1"
              value={formData.applicationsCount}
              onChange={onFieldChange}
              placeholder="0"
              required
            />
          </label>
          <label>
            Total amount
            <input
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalAmount}
              onChange={onFieldChange}
              placeholder="0.00"
              required
            />
          </label>
          <fieldset className="location-fieldset">
            <legend>Location (select one or more)</legend>
            {LOCATION_OPTIONS.map((locationOption) => (
              <label key={locationOption} className="checkbox-label">
                <input
                  type="checkbox"
                  value={locationOption}
                  checked={formData.location.includes(locationOption)}
                  onChange={onLocationChange}
                />
                {locationOption}
              </label>
            ))}
          </fieldset>
          <button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Saving...' : 'Save record'}
          </button>
        </form>
        {successMessage && <p>{successMessage}</p>}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
