# Madni Masjid — Backend API

REST API for the Madni Masjid Management System built with Node.js, Express, MongoDB, and TypeScript.

Deployable in two modes:
- **Standalone server** (local / VPS): `npm run dev`, `npm run build`, `npm run start`
- **Vercel serverless function**: `api/index.ts` exports the Express app (see [Vercel Deploy](#vercel-deploy))

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing (min 8 chars) |
| `FRONTEND_URL` | Frontend origin for CORS |

### Development

```bash
npm run dev        # Start with hot-reload (tsx watch)
npm run build      # Compile TypeScript
npm run start      # Run compiled JS
npm run lint       # ESLint
npm run seed       # Seed admin user + dev data
npm run seed:admin # Seed admin user only
```

## Vercel Deploy

Set the following environment variables in the Vercel project (Settings → Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string (Atlas recommended) |
| `JWT_SECRET` | Yes | Secret for JWT signing (min 8 chars) |
| `JWT_EXPIRES_IN` | No | Token expiry (default `7d`) |
| `FRONTEND_URL` | Yes | Frontend origin for CORS |
| `NODE_ENV` | No | Set to `production` |

Deploy the `backend/` directory as its own Vercel project. `vercel.json` rewrites all requests to the serverless function; `api/index.ts` exports the Express app (no `app.listen()` on Vercel). The Mongoose connection is cached across warm invocations via a module-level promise.

```bash
vercel           # interactive deploy
vercel --prod    # production deploy / alias
```

## Rate Limiting

`POST /api/auth/login` is protected with a **MongoDB-backed** rate limiter (5 failures per email/IP per 15 minutes). It is serverless-safe (shared state via MongoDB, not in-memory counters) and returns `429 Too Many Requests` with a `Retry-After` header when exceeded. Counters reset automatically after the window and on successful login.

## API Endpoints

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | API liveness check (`{"success":true,"status":"ok"}`) |

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user info |

### Users (admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Funds

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/funds` | Any | List funds (paginated) |
| POST | `/api/funds` | Admin/Accountant | Create fund |
| GET | `/api/funds/:id` | Any | Get fund |
| PUT | `/api/funds/:id` | Admin/Accountant | Update fund |
| DELETE | `/api/funds/:id` | Admin | Delete fund |
| GET | `/api/funds/balances/all` | Any | All fund balances |

### Donors

Standard CRUD at `/api/donors`

### Donations

Standard CRUD at `/api/donations`

### Expenses

Standard CRUD at `/api/expenses`

### Construction

| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | `/api/construction` | Projects |
| CRUD | `/api/construction-expenses` | Construction expenses |

### Madrasa

| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | `/api/madrasa/students` | Students |
| CRUD | `/api/madrasa/teachers` | Teachers |

### Receipts (read-only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/receipts` | List receipts |
| GET | `/api/receipts/:id` | Get receipt |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/fund-summary` | Fund summary with balances |
| GET | `/api/reports/donations` | Donation report |
| GET | `/api/reports/expenses` | Expense report |
| GET | `/api/reports/monthly` | Monthly summary |

Query params: `from`, `to`, `fundId`, `paymentMethod`

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard summary |

### Audit Logs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/audit-logs` | Admin/Accountant | List logs |
| DELETE | `/api/audit-logs` | Admin | Clear all |

### Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/settings` | Admin | Get settings |
| PUT | `/api/settings` | Admin | Update settings |

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Roles

| Role | Permissions |
|------|------------|
| `admin` | Full access |
| `accountant` | Financial operations (donations, expenses, funds, etc.) |
| `viewer` | Read-only access |

## Financial Protection

- Expenses are validated against fund balance before creation
- Balance = Total Donations - Total Expenses for each fund
- Insufficient balance returns: `"Insufficient balance in this fund."`

## Pagination

List endpoints support `?page=1&limit=20` query params.

Response format:
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```
