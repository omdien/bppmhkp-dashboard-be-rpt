# AI Agent Instructions for bppmhkp-dashboard-be-rpt

## What this repo is
- Node.js backend service using ESM modules (`"type": "module"` in `package.json`).
- Express.js API server for report endpoints.
- MySQL / Sequelize data access, with some raw SQL queries and model associations.
- Authentication via `src/middleware/auth.js` and JWT token verification.
- Route prefixes are under `/api/report/`.

## Key files and folders
- `server.js` — entry point that loads `src/app.js` and starts the HTTP server.
- `src/app.js` — Express app configuration, middleware, and route registration.
- `src/routes/` — route definitions and router wiring.
- `src/controllers/` — handler logic for each report endpoint.
- `src/validation/` — request validation using `express-validator`.
- `src/models/` — Sequelize model definitions, associations, and generated model code.
- `src/config/Database.js` — database connection setup.
- `src/services/` and `src/repositories/` — business logic / data access abstractions.
- `src/middleware/` — middleware helpers such as auth and request validation.
- `src/tests/` — Jest tests, currently focused on primer report service logic.

## Start and test commands
- `npm run dev` — start server with `nodemon server.js`.
- `npm start` — same as `npm run dev`.
- `npm test` — run Jest using Node experimental VM modules.

## Important conventions
- Many report endpoints are protected with `verifyToken`, but some public report routes exist.
- `src/app.js` enables CORS using `CLIENT_URL` from `.env`.
- Date filters are often passed as query parameters and may be normalized to `00:00:00` / `23:59:59`.
- Responses generally follow `{ success, data, message }` shape.

## Notes for AI code generation
- Keep ESM import/export syntax consistent.
- Do not assume `require()` is available.
- Preserve existing route naming conventions and HTTP query param styles.
- When working with database code, follow the current mix of Sequelize models and raw SQL queries.
- Avoid changing global middleware behavior unless the request explicitly requires it.

## When this file is useful
- Quickly orienting new AI agents to the repository layout.
- Avoiding incorrect assumptions about module type, routing, or database access.
- Knowing where to add new report endpoints and where to place validation logic.
