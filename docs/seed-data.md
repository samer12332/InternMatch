# Evaluation seed data

Run `npm run seed` from `server` to replace the development database with deterministic evaluation data. The script refuses to run in production.

It creates 20 students, 10 companies, 24 internships, deterministic wishes and profile views. Distribution results are intentionally cleared—not seeded—so an admin can demonstrate the real distribution run.

All accounts use `Password123`:

- Admin: `admin1@example.com`
- Student: `student1@example.com` through `student20@example.com`
- Company: `company1@example.com` through `company10@example.com`

Sample data uses Computer Engineering, Information Systems, and Computer Science.
