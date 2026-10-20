# Job Application Tracker

A full-stack application for organizing job applications and tracking their progress.

## Contents

- [Technology](#technology)
- [Local setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Install dependencies](#install-dependencies)
  - [Configure environment variables](#configure-environment-variables)
  - [Set up the database](#set-up-the-database)
  - [Start the application](#start-the-application)
- [Testing and checks](#testing-and-checks)
  - [Fast checks](#fast-checks)
  - [Database tests (optional)](#database-tests-optional)
- [Architecture](#architecture)
- [Deployment](#deployment)
  - [Frontend: Vercel](#frontend-vercel)
  - [Backend: Railway](#backend-railway)

## Technology

- Frontend: React, TypeScript, and Vite
- Backend: Express and TypeScript
- Database: PostgreSQL with Prisma

## Local setup

### Prerequisites

- nvm and the Node version recorded in `.nvmrc`
- A running PostgreSQL database
- Brevo credentials for password-reset emails

### Install dependencies

From the project root:

```sh
nvm install
npm run installDeps
```

### Configure environment variables

Copy the example files:

```sh
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

Edit both `.env` files with your local settings. Replace the backend's database credentials, JWT secret, and email settings.

The example values are placeholders. Never commit your actual `.env` files.

### Set up the database

With PostgreSQL running and your backend environment variables configured, run from the project root:

```sh
npm --prefix Backend run db:migrate
npm run prisma:generate
```

The first command applies the committed migrations to your local database. The second generates Prisma Client, which the backend uses to query that database.

When developing a new database schema change, use `npm run prisma:migrate` to create and apply a migration.

### Start the application

From the project root:

```sh
npm run dev
```

This starts the frontend and backend together.

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

Press Ctrl+C in the terminal to stop both servers.

## Testing and checks

Run these commands from the project root.

Use the [release checklist and known limitations](docs/release-checklist.md) before substantial deployments. File and database recovery steps are in [backup and restore](docs/backup-and-restore.md).

### Fast checks

```sh
npm run check
npm --prefix Backend run build
```

Together, these run frontend and backend linting, both builds, and the fast test suites.

The backend build generates Prisma Client and checks TypeScript; it does not create a compiled server bundle.

### Database tests (optional)

Database tests run separately and require a dedicated PostgreSQL test database.

Create a separate database named `job_tracker_test`.

In `Backend/.env.test.local`, set both `DATABASE_URL` and `DIRECT_URL` to that test database. Set `JWT_SECRET` to a secret used only for testing.

The test suite checks the connected database name before running tests. The migration command does not perform that check, so verify both URLs before applying test migrations.

Email sending is mocked during these tests.

From the project root, run:

```sh
npm --prefix Backend run test:db:migrate
npm --prefix Backend run test:db
```

These commands apply migrations to the configured test database and run the database test suite. Never point the test configuration at your development or production database.

## Architecture

The React frontend sends HTTP requests to the Express backend. The backend validates requests, handles authentication and application logic, and accesses PostgreSQL through Prisma.

### Frontend (`Frontend/src`)

- `pages` and `routes`: application screens and navigation.
- `features`: code grouped by application feature.
- `components`: shared UI components.
- `api`: backend connection configuration.
- `context`, `utils`, and `types`: shared state, helpers, and TypeScript types.

### Backend (`Backend/src`)

- `server.ts`: starts the HTTP server.
- `app.ts`: configures Express middleware and routes.
- `routes`: maps API endpoints to handlers.
- `controllers`: handles requests and responses.
- `schemas`: defines request-validation schemas.
- `middleware`: performs checks such as authentication.
- `services`: handles supporting operations such as email and file cleanup.
- `lib`: configures shared dependencies such as Prisma.

Database models and migrations live in `Backend/prisma`.

## Deployment

The frontend is hosted on Vercel, and the backend is hosted on Railway.

### Frontend: Vercel

- Root directory: `Frontend`
- Framework preset: Vite
- Build command: default Vite build (`npm run build`)
- Output directory: `dist`

Leave `VITE_API_URL` unset or empty in Vercel so the frontend uses relative URLs.

`Frontend/vercel.json` forwards `/api` and `/uploads` requests to Railway. Its final rewrite serves `index.html` for frontend routes.

If the backend hostname changes, update both Railway destinations in `Frontend/vercel.json`.

### Backend: Railway

- Root directory: `/Backend`
- Build command: `npm run build`
- Pre-deploy command: `npm run db:migrate`
- Start command: `npm start`

The build generates Prisma Client and checks TypeScript. The pre-deploy command applies committed database migrations before the server starts.

Configure these environment variables in Railway:

- `NODE_ENV=production`
- `DATABASE_URL`: production database connection URL
- `DIRECT_URL`: database connection URL used for migrations
- `JWT_SECRET`: a production secret
- `FRONTEND_URL`: the deployed frontend URL
- `BREVO_API_KEY`: email provider credentials
- `EMAIL_FROM_ADDRESS`: the configured sender address
- `EMAIL_FROM_NAME`: optional sender display name

Keep production credentials in the hosting providers' environment settings.
