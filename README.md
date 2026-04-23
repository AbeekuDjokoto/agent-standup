# Loan Activity Tracker

Web app for agents to capture loan activity and export backend data as an Excel file.

## Required fields

- `location`
- `day`
- `number of applications`
- `total value of loans`
- `first name`
- `last name`

## Run locally

1. Install dependencies:

   `npm install`

2. Start backend API:

   `npm run dev:server`

3. Start frontend app (in a separate terminal):

   `npm run dev`

4. Open the frontend URL printed by Vite (usually `http://localhost:5173`).

## API endpoints

- `GET /api/health` - health check
- `GET /api/loan-entries` - list entries and summary totals
- `POST /api/loan-entries` - create one entry
- `GET /api/loan-entries/export` - download Excel report (`.xlsx`)
