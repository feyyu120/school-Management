# School Management System — Frontend

Dark-themed Single Page Application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🎨 Design System Guidelines

- **Primary Background**: `black` / near-black (`#000000`, `#0a0a0a`)
- **Text & Borders**: High contrast `white` & subtle `neutral-800` borders
- **Active / Focused / Hover States**: `#1b2d53`
- **Strict Aesthetic Constraints**: Minimalist, clean, no gradients, glassmorphism, or excessive shadows.

---

## 🛠️ Environment Configuration (`.env`)

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 💻 Running Development & Production Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typecheck & production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Architecture & Key Modules

```text
src/
├── components/
│   ├── common/         # Button, Input, Modal, Loading, ErrorMessage, EmptyState
│   └── layout/         # Sidebar, Navbar, DashboardLayout
├── context/
│   └── AuthContext.tsx # Centralized auth state & JWT persistence
├── hooks/
│   └── useAuth.ts      # Auth hook consumer
├── pages/
│   ├── admin/          # Dashboard, PendingUsers, Students, Teachers, Announcements, Admissions
│   ├── auth/           # Login, StudentRegister, TeacherRegister
│   ├── shared/         # Profile
│   ├── student/        # Dashboard, Results, Attendance, Announcements, Admissions, Report
│   └── teacher/        # Dashboard, Students, Attendance, Grades
├── routes/
│   ├── AppRoutes.tsx   # React Router v6 mapping
│   └── ProtectedRoute.tsx # Role-Based Access Control wrapper
└── services/           # API fetch client functions (admin, auth, grades, etc.)
```

---

## 🔒 Authentication & Role Protection

- Access tokens are stored in `localStorage` and attached via `Authorization: Bearer <token>` in `src/services/api.ts`.
- Routes are protected via `<ProtectedRoute allowedRoles={['admin']}>` components.
- Direct navigation unauthorized attempts automatically redirect users to their assigned role dashboard.