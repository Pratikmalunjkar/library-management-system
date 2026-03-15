# Book Library Management System — Frontend

## Tech Stack
- React.js
- React Router DOM
- Axios (API calls)
- Custom CSS (no Bootstrap/Tailwind/MUI)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Make sure backend is running on
```
http://localhost:5000
```

## Project Structure
```
src/
├── api/            → Axios API functions per module
├── components/     → Shared components (Navbar)
├── pages/
│   ├── admin/      → Admin pages
│   ├── auth/       → Login, OTP verify
│   ├── authors/    → Author dashboard, apply, submit book
│   ├── books/      → Books list, details, read PDF
│   ├── rentals/    → Rentals page
│   ├── wishlist/   → Wishlist page
│   └── UserDashboard.js
├── utils/          → JWT decode helpers
└── App.js          → Routes
```

## Pages
| Page | Path | Role |
|---|---|---|
| Login | `/` | All |
| Verify OTP | `/verify-otp` | All |
| Books | `/books` | All |
| Book Details | `/books/:id` | All |
| Read Book | `/books/:id/read` | All |
| Wishlist | `/wishlist` | USER |
| Rentals | `/rentals` | USER |
| Dashboard | `/dashboard` | USER |
| Apply Author | `/apply-author` | USER |
| Author Dashboard | `/author` | AUTHOR |
| Submit Book | `/author/submit-book` | AUTHOR |
| Admin Dashboard | `/admin` | ADMIN |
| Manage Books | `/admin/books` | ADMIN |
| Author Approvals | `/admin/authors` | ADMIN |
| Submissions | `/admin/submissions` | ADMIN |
| Admin Rentals | `/admin/rentals` | ADMIN |
| Moderate Reviews | `/admin/reviews` | ADMIN |
| Users List | `/admin/users` | ADMIN |
| Authors List | `/admin/authors-list` | ADMIN |