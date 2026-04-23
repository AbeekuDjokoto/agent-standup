import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './App.css'
import { LOCATION_OPTIONS } from './data/locationOptions'
import { postAgentRecord } from './services/agentService'

const numberField = (fieldName, schema) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === undefined || value === null) {
        return undefined
      }
      const parsedValue = Number(value)
      return Number.isNaN(parsedValue) ? undefined : parsedValue
    },
    z.number({
      required_error: `${fieldName} is required.`,
      invalid_type_error: `${fieldName} must be a number.`,
    }).pipe(schema),
  )

const formSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  applicationsCount: numberField(
    'Applications count',
    z
      .number()
      .int('Applications count must be a whole number.')
      .min(0, 'Applications count must be 0 or greater.'),
  ),
  totalAmount: numberField(
    'Total amount',
    z.number().min(0, 'Total amount must be 0 or greater.'),
  ),
  location: z.array(z.string()).min(1, 'Select at least one location.'),
})

function App() {
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      applicationsCount: '',
      totalAmount: '',
      location: [],
    },
  })

  const selectedLocations = useWatch({
    control,
    name: 'location',
  })

  async function onSubmit(values) {
    setError('')
    setSuccessMessage('')

    try {
      const payload = {
        fullName: values.fullName.trim(),
        applicationsCount: values.applicationsCount,
        totalAmount: values.totalAmount,
        location: values.location,
        createdAt: new Date().toISOString(),
      }
      await postAgentRecord(payload)
      reset({
        fullName: '',
        applicationsCount: '',
        totalAmount: '',
        location: [],
      })
      setSuccessMessage('Record saved successfully.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to save record.',
      )
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
        <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Full name
            <input
              {...register('fullName')}
              placeholder="Abeeku Djokoto"
            />
          </label>
          {errors.fullName && (
            <p className="error" role="alert">
              {errors.fullName.message}
            </p>
          )}
          <label>
            Applications count
            <input
              type="number"
              min="0"
              step="1"
              {...register('applicationsCount')}
              placeholder="0"
            />
          </label>
          {errors.applicationsCount && (
            <p className="error" role="alert">
              {errors.applicationsCount.message}
            </p>
          )}
          <label>
            Total amount
            <input
              type="number"
              min="0"
              step="0.01"
              {...register('totalAmount')}
              placeholder="0.00"
            />
          </label>
          {errors.totalAmount && (
            <p className="error" role="alert">
              {errors.totalAmount.message}
            </p>
          )}
          <fieldset className="location-fieldset">
            <legend>Location (select one or more)</legend>
            {LOCATION_OPTIONS.map((locationOption) => (
              <label key={locationOption} className="checkbox-label">
                <input
                  type="checkbox"
                  value={locationOption}
                  {...register('location')}
                  checked={selectedLocations?.includes(locationOption) ?? false}
                />
                {locationOption}
              </label>
            ))}
          </fieldset>
          {errors.location && (
            <p className="error" role="alert">
              {errors.location.message}
            </p>
          )}
          <button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save record'}
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
