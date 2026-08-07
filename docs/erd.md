# InternMatch ERD

```mermaid
erDiagram
  USER ||--o| STUDENT_PROFILE : has
  USER ||--o| COMPANY_PROFILE : has
  COMPANY_PROFILE ||--o{ INTERNSHIP : posts
  STUDENT_PROFILE ||--o{ APPLICATION : submits
  INTERNSHIP ||--o{ APPLICATION : is_wished_for
  STUDENT_PROFILE ||--o{ PROFILE_VIEW : receives
  COMPANY_PROFILE ||--o{ PROFILE_VIEW : creates
  STUDENT_PROFILE ||--o| DISTRIBUTION_RESULT : receives
  INTERNSHIP o|--o{ DISTRIBUTION_RESULT : assigned_to

  USER {
    uuid id PK
    string email UK
    UserRole role
  }
  STUDENT_PROFILE {
    uuid id PK
    uuid userId FK, UK
    string nationalId UK
    decimal gpa
    string major
    string city
  }
  COMPANY_PROFILE {
    uuid id PK
    uuid userId FK, UK
  }
  INTERNSHIP {
    uuid id PK
    uuid companyId FK
    string major
    decimal minimumGpa
    int capacity
  }
  APPLICATION {
    uuid id PK
    uuid studentId FK
    uuid internshipId FK
    int wishOrder
  }
  PROFILE_VIEW {
    uuid id PK
    uuid studentId FK
    uuid companyId FK
  }
  DISTRIBUTION_RESULT {
    uuid id PK
    uuid studentId FK, UK
    uuid internshipId FK
    int wishOrder
  }
```

## Design decisions

- `User` is separated from `StudentProfile` and `CompanyProfile` so authentication identity and role remain independent of role-specific information.
- `Application` represents one ranked internship wish; its unique constraints prevent duplicate wishes and duplicate ranking positions per student.
- Major and city remain strings because their permitted values are not defined.
- Internship capacity is an assumption needed to make ranking and distribution meaningful.
- `ProfileView` records individual viewing events, enabling a student's view count to be derived.
- Only the current `DistributionResult` is stored; ranking and distribution history are out of scope.
