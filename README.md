# InternMatch

InternMatch is an internship distribution platform. Students register, browse eligible internships, and rank up to three wishes. Companies publish internships and search student profiles. An admin runs the final allocation, after which students can see their result and profile-view count.

## Tech stack

- Frontend: React, TypeScript, Vite, Bootstrap, Axios
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL
- Authentication: JWT and bcryptjs

## Architecture

`React client → REST API → Express → service layer → Prisma → PostgreSQL`

The repository contains separate frontend (`/client`) and backend (`/server`) applications, with supporting notes in `/docs`.

## Main features

**Students:** register/login, browse eligible internships, maintain up to three ranked wishes, see profile views, and see a final distribution result.

**Companies:** register/login, create/list/edit/delete internships, search students by major/city/GPA/bio, and view safe student profiles. Companies can delete only their own unused internships; once student wishes/applications exist, deletion is rejected and those wishes are never cascade-deleted. In production, an archive or status workflow may be preferable once an internship enters an active application lifecycle.

**Admin:** run distribution, inspect its summary, and review current results.

## Core business rules

- A student may select at most three wishes; order is inferred from array position and is contiguous `1..N`.
- A wish is allowed only when the internship has a matching major and `minimumGpa <= student.gpa`.
- Internship capacity limits final assignments, not the number of wishes.
- A company has a configurable per-major posting limit (`MAX_INTERNSHIPS_PER_MAJOR`, default `3`).
- Ownership comes from authenticated users; the client does not provide company/student ownership IDs.

## Distribution algorithm

Major is a hard eligibility condition, not a weighted score. Allocation is completed in wish rounds `1 → 2 → 3`. Within an internship and a single round, higher GPA wins; ties use `Application.createdAt` ascending, then application ID. Remaining capacity carries across all rounds, and students who remain without an assignment are `UNASSIGNED`.

The decision to complete all first wishes before considering second wishes is this project’s documented interpretation of ambiguous assignment wording—not the only possible policy. Current `DistributionResult` rows link to their winning `Application`; rerunning replaces the current result set.

## Important assumptions

- GPA uses a `0–4` scale.
- Capacity was introduced to make final distribution meaningful.
- `ADMIN` executes the global distribution.
- Major remains a String because no official controlled list was supplied.
- Bio search is case-insensitive substring matching.
- A company’s “request number of applications” is interpreted as filtered, paginated student search.

## Setup

### Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env
npx prisma migrate deploy
npm run seed
npm run dev
```

### Frontend

```powershell
cd client
npm install
Copy-Item .env.example .env
# Set VITE_API_URL (normally http://localhost:4000/api)
npm run dev
```

## Demo accounts

Deterministic evaluation-only credentials; all use `Password123`:

- Admin: `admin1@example.com`
- Student: `student1@example.com`
- Company: `company1@example.com`

## Seed data

`npm run seed` creates a deterministic development dataset: 20 students, 10 companies, 24 internships, valid ranked wishes, and profile views. It intentionally does **not** seed `DistributionResult`; log in as admin and run distribution during the demo. The seed refuses to run in production and resets the development database.

## API overview

- **Auth:** `POST /api/auth/register/student`, `POST /api/auth/register/company`, `POST /api/auth/login`, `GET /api/auth/me`
- **Student:** `/api/students/me/internships`, `/wishes`, `/profile-summary`, `/distribution-result`
- **Company:** `/api/company/internships`, `/api/company/students`, `GET /api/company/students/:studentId`, `POST /api/company/students/:studentId/views`
- **Admin:** `POST /api/admin/distribution/run`, `GET /api/admin/distribution/summary`, `GET /api/admin/distribution/results`

## Testing

Run focused backend tests with `cd server; npm run test`. They cover eligibility, wish limits, case-insensitive posting-limit behavior, GPA priority, wish-round fallback, and the first-wish-round interpretation. Manual end-to-end verification is covered by [the demo checklist](docs/demo-checklist.md); this project does not claim exhaustive coverage.

## Future improvements

- HttpOnly cookie/refresh-session authentication
- Controlled Major table or enum
- Full-text/similarity bio search
- Stronger database-level posting-limit concurrency control
- Distribution run history
- More integration and E2E tests
- Explicit internship archive/delete rules
