# Internship Distribution Platform — Initial Analysis

## System overview

The platform distributes internship opportunities among students. Students provide their details, browse eligible opportunities, submit ranked wishes, and view their distribution outcome. Companies publish internships and search student profiles. An admin runs the distribution process and reviews its results.

## Actors

### Student

- Registers personal and technical information.
- Browses eligible internships.
- Selects up to three internship wishes.
- Views the distribution result.
- Views the profile view count.

### Company

- Posts internship opportunities.
- Searches students by major, city, GPA, and bio.
- Views student profiles.

### Admin

- A minimal system role introduced as a design assumption.
- Runs the internship distribution process.
- Views ranking and distribution results.

## Core functional requirements

- Student registration.
- Company registration.
- Internship posting.
- Internship eligibility based on major and GPA.
- A maximum of three student wishes.
- Student distribution and ranking.
- Company student search.
- Student profile-view tracking.
- Distribution summary.

## Non-functional requirements

- Maintainable architecture.
- Basic security.
- Data integrity.
- Reasonable performance.
- Responsive UI.
- Clear error handling.

## Explicit assumptions

- Each internship has a capacity because ranking and distribution require limited available positions.
- `MAX_INTERNSHIPS_PER_MAJOR` is configurable; the evaluation default is 3 postings per company and major. This is separate from `Internship.capacity`, which is the number of available student slots.
- A minimal `ADMIN` role exists to execute distribution.
- A company's “request number of applications” means filtered student search with a result limit.
- Bio search initially uses simple case-insensitive text matching.
- Major is a hard eligibility rule, not a numeric ranking weight.

## Architecture decisions

The application will use the following flow:

`React client → REST API → Express → PostgreSQL`

The backend will follow:

`Route → Controller → Service → Prisma`

Routes define API endpoints, controllers handle request/response concerns, services contain business rules, and Prisma handles database access. Business rules belong in services so that rules such as eligibility, wish limits, and distribution ranking remain reusable, testable, and independent of HTTP handling.

## Out of scope

The following are future improvements and should not be implemented until the core assignment is complete:

- Email verification.
- Password reset.
- Refresh-token rotation.
- OAuth.
- Notifications.
- Chat.
- File upload.
- AI embeddings.
- Microservices.
