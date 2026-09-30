# OctoFit Tracker Frontend

React 19 presentation tier for the OctoFit Tracker API.

## Run locally

Set `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` when running the frontend in a Codespace:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

This variable is required to connect a Codespaces frontend to its API at `https://<name>-8000.app.github.dev`. Restart Vite after changing it. When it is unset, API requests use `http://localhost:8000` for local development.

```bash
npm run dev --prefix octofit-tracker/frontend
```
