# School Management System — Backend API

RESTful API backend for the School Management System written in **Go 1.22+**, **Fiber v3**, and **PostgreSQL**.

---

## 🚀 Tech Stack & Libraries

- **Language**: Go 1.22+
- **HTTP Framework**: [Fiber v3](https://github.com/gofiber/fiber)
- **Database Driver**: `pgx/v5` & `pgxpool`
- **Authentication**: JWT (`golang-jwt/jwt/v5`)
- **Password Hashing**: `golang.org/x/crypto/bcrypt`
- **Configuration**: `.env` file via `joho/godotenv`

---

## 🛠️ Configuration (`.env`)

Create a `.env` file in `backend/`:

```env
DB_URL="postgresql://username:password@localhost:5432/school_db?sslmode=disable"
JWT_SECRET="your-secret-key-here"
PORT="8080"
JWT_EXPIRES_IN="24h"
```

---

## 🗄️ Database Setup & Migrations

PostgreSQL migration scripts are stored in `migrations/`:
- `migrations/000001_init_schema.up.sql`
- `migrations/000001_init_schema.down.sql`

To apply the schema:
```bash
psql -U postgres -d school_db -f migrations/000001_init_schema.up.sql
```

---

## 💻 Running the Server

```bash
# Clean and tidy dependencies
go mod tidy

# Run the development API server
go run cmd/api/main.go

# Build production binary
go build -o bin/api cmd/api/main.go
```

---

## 🌐 Deploying to Render

### Option A: Render Dashboard Settings (Manual Web Service)
1. **Root Directory**: `backend`
2. **Environment**: `Go`
3. **Build Command**: `go build -o api ./cmd/api`
4. **Start Command**: `./api`
5. **Environment Variables**:
   - `DB_URL`: `postgresql://<user>:<password>@<host>/<database>?sslmode=require`
   - `JWT_SECRET`: `<your-secure-jwt-secret>`
   - `JWT_EXPIRES_IN`: `24h`
   - `PORT`: `10000` (or leave default for Render)

### Option B: Render Blueprint (`render.yaml`)
A `render.yaml` file is included in the project root. Connect your repository to Render Blueprints for automatic deployment.

---

## 📡 API Endpoints Overview

### **Auth & Profile (`/api/v1/auth`, `/api/v1/profile`)**
- `POST /api/v1/auth/login` — Login user (Admin / Teacher / Student)
- `POST /api/v1/auth/register/student` — Register student account (pending status)
- `POST /api/v1/auth/register/teacher` — Register teacher account (pending status)
- `GET /api/v1/profile` — Fetch current user profile details
- `GET /api/v1/student/report` — Fetch academic summary report (Student only)

### **Admin Management (`/api/v1/admin`)**
- `GET /api/v1/admin/dashboard` — Get dashboard aggregate metrics
- `GET /api/v1/admin/pending-users` — List pending user approvals
- `PATCH /api/v1/admin/users/:id/approve` — Approve pending account
- `PATCH /api/v1/admin/users/:id/reject` — Reject pending account
- `GET /api/v1/admin/students` — List all registered students
- `GET /api/v1/admin/teachers` — List all registered teachers

### **Attendance (`/api/v1/attendance`)**
- `POST /api/v1/attendance` — Record attendance (Teacher only)
- `PUT /api/v1/attendance/:id` — Update attendance status (Teacher only)
- `GET /api/v1/attendance/my-students` — List attendance recorded by teacher
- `GET /api/v1/attendance/my-attendance` — List student's own attendance records

### **Grades (`/api/v1/grades`)**
- `POST /api/v1/grades` — Record grade (Teacher only)
- `PUT /api/v1/grades/:id` — Update grade (Teacher only)
- `GET /api/v1/grades/my-students` — List grades recorded by teacher
- `GET /api/v1/grades/my-grades` — List student's own grades

### **Announcements (`/api/v1/announcements`)**
- `GET /api/v1/announcements` — List announcements (Authenticated users)
- `POST /api/v1/announcements` — Create announcement (Admin only)
- `PUT /api/v1/announcements/:id` — Update announcement (Admin only)
- `DELETE /api/v1/announcements/:id` — Delete announcement (Admin only)

### **Admissions (`/api/v1/admissions`)**
- `GET /api/v1/admissions` — List admission notices (Authenticated users)
- `POST /api/v1/admissions` — Create admission notice (Admin only)
- `PUT /api/v1/admissions/:id` — Update admission notice (Admin only)
- `DELETE /api/v1/admissions/:id` — Delete admission notice (Admin only)
