# Rescue-Net.eu

## Monorepo Structure

- apps/web    — Next.js 15 + Tailwind (TypeScript, i18n for 24 EU languages)
- apps/api    — NestJS 11 + Prisma 2 (TypeScript, authentication, CRUD, alert flow, membership management)
- apps/mobile — React Native (TypeScript, i18n, same functionality as web)
- packages/ui — shared React components (empty placeholder)
- packages/types — shared TypeScript types (empty placeholder)

## Existing Code Replaced

- Static HTML+JS frontend has been fully replaced by Next.js (web) and React Native (mobile), using i18n (next-i18next/react-i18next).
- Python backend (FastAPI) has been fully replaced by NestJS+Prisma (including routing, CRUD, authentication, mission flow, alert flow, and membership management).

## Setup Instructions

Ensure you have **Node.js 20** or higher installed.

1. Clone repo and install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_VAPID_KEY`

3. Run Prisma migrations:
```bash
cd apps/api
npx prisma migrate dev --name init
```

4. Optionally integrate translations with Transifex:
- `tx push -s` to upload `en/common.json`.
- After translations, `tx pull -a --mode=reviewed` to retrieve translated files.

5. Start backend, web, and mobile:
```bash
Terminal 1 (backend):
cd apps/api
npm run start:dev

Terminal 2 (web):
cd apps/web
npm run dev

Terminal 3 (mobile iOS - macOS):
cd apps/mobile
npx react-native run-ios

Terminal 4 (mobile Android):
cd apps/mobile
npx react-native run-android
```

6. Test the flows:
- **Volunteer (web):**
  • `http://localhost:3000/signup/<token>` (fill out form, texts appear in chosen language).
  • `http://localhost:3000/signup/direct` (direct signup).
  • `http://localhost:3000/login` (login, JWT storage).
  • `http://localhost:3000/dashboard` (view missions and local alerts, subscribe).
- **Volunteer (mobile):**
  • Open the app, use SignupToken, SignupDirect, Login, VolunteerDashboard screens, verify texts appear in device language or manually changed language.
- **Operator/Admin:**
  • Web: `http://localhost:3000/admin/alerts` (create alert, view/approve, filter).
  • Mobile: AdminAlertsScreen with create/approve alerts.
- **Memberships:**
  • Verify membership management endpoints (GET /memberships, POST /memberships, PATCH /memberships/:id, DELETE /memberships/:id).
- **PLATFORM_ADMIN:**
  • Access global dashboard to approve PENDING_APPROVAL alerts (PATCH /api/alerts/:id/status).

Note:
- All UI text (e.g., “Create Alert” / “Creează Alertă”, “Subscribe to Alert” / “Abonează-te la Alertă”, etc.) is managed via JSON files in `public/locales/{lang}/common.json` (web) and `src/locales/{lang}/common.json` (mobile).
- The previous code, which did not implement membership endpoints or password-based authentication and lacked alert flow, has been fully replaced.
- Ensure each file generated strictly follows this specification, including i18n and Transifex integration.

## Running with Docker Compose

1. Build and start all services (Postgres, API, Web):
   ```bash
   docker-compose up --build
   ```

2. Apply Prisma migrations inside the API container:

   ```bash
   docker-compose exec api npx prisma migrate dev --name init
   ```

   (Or use `npx prisma migrate deploy` in production.)

Visit the web app at http://localhost:3001. The Next.js frontend automatically calls the API at http://api:3000 inside Docker.

The API is available at http://localhost:3000. You can test the health endpoint:

```bash
curl http://localhost:3000/health
```

To stop and remove containers:

```bash
docker-compose down
```

If you need to reset the database data:

```bash
docker-compose down -v
rm -rf postgres-data
docker-compose up --build
docker-compose exec api npx prisma migrate dev --name init
```
