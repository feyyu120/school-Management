# School Management System (MVP)

A full-stack School Management System built with a **Go (Fiber 3) + PostgreSQL** REST API backend and a **React + TypeScript + Tailwind CSS** dark-themed frontend.

---

## 🌟 Tech Stack

### **Backend**
- **Language**: Go 1.22+
- **Framework**: Fiber v3
- **Database**: PostgreSQL with `pgx/v5` & `pgxpool`
- **Authentication**: JWT & bcrypt password hashing
- **Config**: `.env` environment variables

### **Frontend**
- **Framework**: React 18+ with TypeScript & Vite
- **Styling**: Tailwind CSS (Dark theme design system `#000000` / `#1b2d53`)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Custom centralized fetch wrapper (`api.ts`)

---

## 📁 Project Structure

```text
school-Management/
├── backend/                  # Go Fiber 3 Backend API
│   ├── cmd/api/main.go       # Server entrypoint
│   ├── internal/             # Application logic modules
│   │   ├── admissions/       # Admissions CRUD
│   │   ├── announcements/    # Announcements CRUD
│   │   ├── attendance/       # Attendance tracking
│   │   ├── auth/             # Authentication & Registration
│   │   ├── config/           # App configuration
│   │   ├── database/         # PostgreSQL connection pool
│   │   ├── grades/           # Grade recording & results
│   │   ├── middleware/       # JWT & Role-Based Access Control (RBAC)
│   │   └── users/            # User profile & reports
│   └── migrations/           # PostgreSQL schema migration files
│
└── frontend/                 # React TypeScript Vite Frontend
    ├── src/
    │   ├── components/       # Layout & reusable UI components
    │   ├── context/          # AuthContext (JWT management)
    │   ├── hooks/            # Custom hooks (useAuth)
    │   ├── pages/            # Auth, Admin, Teacher, Student pages
    │   ├── routes/           # AppRoutes & ProtectedRoute (RBAC)
    │   ├── services/         # API service layer wrappers
    │   └── types/            # TypeScript data interfaces
```

---

## ⚙️ Quick Start Guide

### 1. Database Setup
Create a PostgreSQL database (default name: `school_db`):
```sql
CREATE DATABASE school_db;
```
Run the migration script located at `backend/migrations/000001_init_schema.up.sql`.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create or verify your `.env` file:
   ```env
   DB_URL="postgresql://username:password@localhost:5432/school_db?sslmode=disable"
JWT_SECRET="your-secret-key-here"
PORT="8080"
JWT_EXPIRES_IN="24h"
   ```
3. Run the backend server:
   ```bash
   go run cmd/api/main.go
   ```
   The backend API will run at `http://localhost:8080/api/v1`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create or verify your `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
3. Install dependencies and start development server:
   ```bash
   npm install
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## 🔑 Default Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `admin123` |
| **Teacher** | `snape@school.com` | `password123` |
| **Student** | `harry@school.com` | `password123` |

---

## 👥 Features & Role Permissions

### 👑 Admin
- System summary & statistics dashboard.
- Approve or reject pending student/teacher registrations.
- View directory of all students and teachers.
- Create, edit, and delete school announcements.
- Create, edit, and delete admission notices.

### 👨‍🏫 Teacher
- View assigned students.
- Record and update student attendance (`present`, `absent`, `late`).
- Record and update student grades by subject, exam type, and semester.
- View teacher profile.

### 🎓 Student
- Register with Student ID, grade, and class details.
- View personal grades and average score.
- View attendance records & summary count.
- View school announcements and admission notices.
- View and print comprehensive academic summary report.
