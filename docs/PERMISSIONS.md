# Andalusia Academy — Permission Matrix (Sprint 4)

Permissions are enforced **in the API**, not only in the frontend.

- **Role check:** every protected controller/action has `[Authorize(Roles = ...)]` (role names live in `Helpers/Roles.cs`).
  No token → **401 Unauthorized**. Wrong role → **403 Forbidden**.
- **Ownership check:** an instructor can only manage courses they teach (`InstructorService.EnsureOwnsCourseAsync`).
  Not their course → **403**, course doesn't exist → **404**.
- **Enrollment check:** a learner can only open course content they are enrolled in (`LearnerService.EnsureCanAccessCourseAsync`).
  Not enrolled → **403**. Submitting work / marking materials done requires an **Active** enrollment.
- **Account check:** deactivated users cannot log in (`AuthService`).

Legend: ✅ allowed · 🔒 only own records · — not allowed (403) · 🌐 public (no login)

## Matrix

| Area / action | Visitor | Learner | Instructor | Admin | Content Manager |
|---|---|---|---|---|---|
| Browse courses, programs, career paths, categories | 🌐 | ✅ | ✅ | ✅ | ✅ |
| Register / log in | 🌐 | — | — | — | — |
| View / edit own profile (`/api/auth/me`) | — | ✅ | ✅ | ✅ | ✅ |
| Create / edit / delete courses, programs, career paths, categories | — | — | — | ✅ | — |
| Create / edit / delete partners, testimonials | — | — | — | ✅ | ✅ |
| Apply to a course or program | — | ✅ | — | — | — |
| Pay for an application, view own payments | — | 🔒 | — | — | — |
| View own applications and enrollments | — | 🔒 | — | — | — |
| Learner dashboard, my courses | — | 🔒 | — | — | — |
| Open enrolled course: info, sessions, own attendance | — | 🔒 enrolled | — | — | — |
| View materials, mark a material done | — | 🔒 enrolled | — | — | — |
| View / submit assignments (until graded) | — | 🔒 enrolled | — | — | — |
| Instructor dashboard, my courses, my students + progress | — | — | 🔒 own courses | — | — |
| Create / edit / delete sessions | — | — | 🔒 own courses | — | — |
| Take attendance | — | — | 🔒 own courses | — | — |
| Add / upload / edit / delete materials | — | — | 🔒 own courses | — | — |
| Create / edit / delete assignments, view submissions, grade | — | — | 🔒 own courses | — | — |
| Admin dashboard (stats, revenue) | — | — | — | ✅ | — |
| List users, activate / deactivate users | — | — | — | ✅ | — |
| Create instructor accounts | — | — | — | ✅ | — |
| Edit course schedule / details, assign instructor | — | — | — | ✅ | — |
| View all payments | — | — | — | ✅ | — |

## Endpoint groups

| Route | Required role |
|---|---|
| `GET /api/courses`, `/programs`, `/career-paths`, `/categories`, `/partners`, `/testimonials` | none (public) |
| `POST/PUT/DELETE /api/courses`, `/programs`, `/career-paths`, `/categories` | Admin |
| `POST/PUT/DELETE /api/partners`, `/testimonials` | Admin or ContentManager |
| `/api/auth/me` | any logged-in user |
| `/api/applications`, `/api/payments`, `/api/enrollments` | Learner |
| `/api/learner/*` | Learner (+ enrollment check) |
| `/api/instructor/*` | Instructor (+ ownership check) |
| `/api/admin/*` | Admin |

## Demo step 25 — showing a blocked action

1. Log in as `learner@andalusia.edu` / `Learner@123` and copy the token into Swagger's **Authorize**.
2. Call `DELETE /api/courses/1` → **403 Forbidden**.
3. Call `GET /api/instructor/dashboard` → **403 Forbidden**.
4. Log in as `instructor@andalusia.edu` / `Instructor@123` and call `GET /api/instructor/courses/3/students`
   (SQL Server Essentials, taught by Mona) → **403 "You can only manage courses you teach."**
5. In the browser, a learner opening `/admin` sees **"You do not have permission to view this page."**
