# InfraPulse — Frontend

Smart Public Infrastructure Reporting Platform — citizen/officer/manager/admin
portals for reporting and resolving civic issues (potholes, broken lights,
garbage, water leakage, etc).

React 19 + Vite + JavaScript, built to talk to a Spring Boot 3.x backend.

## Stack

- React 19, React Router 6
- Tailwind CSS (dark mode via class strategy)
- TanStack Query (server state/caching)
- React Hook Form (all forms + validation)
- React Leaflet + OpenStreetMap tiles + Nominatim (geocoding) — all free, no Google Maps
- Recharts (analytics charts)
- Framer Motion (modal/page transitions)
- @stomp/stompjs + sockjs-client (WebSocket real-time updates)
- Axios with JWT access/refresh interceptors
- Cloudinary free-tier unsigned upload (client-side, no backend signing needed)
- react-hot-toast, lucide-react

## Getting started

```bash
npm install
cp .env.example .env   # fill in your backend URL + Cloudinary preset
npm run dev
```

Runs on `http://localhost:5173`. The Vite dev server proxies `/api` and `/ws`
to `http://localhost:8080` (your Spring Boot backend) — see `vite.config.js`.

## Folder structure

```
src/
  api/          axios instance + one file per resource (auth, complaints, users, ai)
  context/      AuthContext (JWT/user state), ThemeContext (dark mode)
  hooks/        useAuth, useTheme, useWebSocket (STOMP)
  routes/       ProtectedRoute (auth gate), RoleRoute (role gate)
  layouts/      AuthLayout (split-screen login/register), DashboardLayout (sidebar+navbar)
  components/
    common/     Button, Input, Textarea, Select, Card, Badge, Modal, Loader, EmptyState
    layout/     Navbar, Sidebar (role-aware nav), ThemeToggle
    map/        MapPicker (create complaint), ComplaintMap (browse/detail)
    charts/     TrendChart, CategoryChart
    complaints/ ComplaintCard, ComplaintForm, StatusBadge/PriorityBadge
  pages/
    auth/       Login, Register, ForgotPassword
    citizen/    Dashboard, CreateComplaint, MyComplaints, ComplaintDetail, Bookmarks, Profile
    officer/    Dashboard, AssignedComplaints, ComplaintUpdate (progress + chat)
    manager/    Dashboard, ManageOfficers (assign complaints), DepartmentStats
    admin/      Dashboard, UserManagement, Departments, AuditLogs, Analytics
  utils/        constants, helpers, validators, cloudinary.js, geocoding.js
```

## What's implemented

- Full auth flow (login/register/forgot password) with JWT + auto refresh-token retry
- Role-based routing: a citizen can never see officer/manager/admin routes and vice versa
- Citizen: report an issue (map picker + Cloudinary photo upload + AI-assist for
  title/category/duplicate-detection), track complaints, bookmarks, comments, rating, profile
- Officer: assigned queue with accept/reject, progress updates with photo + status change,
  live chat with the citizen over STOMP
- Manager: department overview with charts, officer leaderboard, assign unassigned complaints
- Admin: system-wide dashboard, user/role management, departments CRUD, audit logs, analytics
  with a complaint density map
- Dark mode (persisted), responsive layout, toasts, reusable component library

## Backend contract this expects

All endpoints are called with a base of `VITE_API_BASE_URL` (default `/api`).
The full list of expected endpoints is visible in `src/api/*.js` — that's your
API spec for the Spring Boot side (auth, complaints, users/admin, ai). Expected
response shapes are inferred from how they're consumed in the pages (e.g.
`getMine()` returns `{ content, stats, totalPages }` for pagination + summary
stats in one call).

## AI features

The frontend never calls Hugging Face directly — it calls your backend
(`/ai/suggest-category`, `/ai/predict-priority`, `/ai/check-duplicate`,
`/ai/generate-title`, `/ai/improve-description`), which should proxy to the
free HF Inference API server-side so no token is exposed to the browser.

## Not yet built (flag for backend/part 2 or a follow-up pass)

- True heatmap tile layer (currently a marker map on the density endpoint —
  swap in `leaflet.heat` if you want a real gradient heatmap)
- Typing indicators for officer↔citizen chat (the STOMP hook is ready, just
  needs a `/topic/complaints/:id/typing` publish on keypress)
- Complaint clustering on the map (marker clustering plugin not wired up yet)

## Deployment

- Frontend: Vercel (`vercel.json` not included — default Vite build works out
  of the box: build command `npm run build`, output dir `dist`)
- Set `VITE_API_BASE_URL` and `VITE_WS_URL` to your deployed Render/Railway
  backend URL in Vercel's environment variables
