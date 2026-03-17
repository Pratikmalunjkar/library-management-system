#  Book Library Management System

A full-stack web application for managing digital and physical library operations. Built with React.js (Frontend) and Node.js + Express (Backend) with PostgreSQL database.

---

## 🔗 Repositories

| Part | Repository |
|---|---|
| Backend | https://github.com/Pratikmalunjkar/library-management-backend |
| Frontend | https://github.com/Pratikmalunjkar/library-management-frontend |

Main repository
https://github.com/Pratikmalunjkar/library-management-system

---

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Custom CSS (No Bootstrap/Tailwind/MUI)

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Nodemailer
- Multer (File Upload)
- Swagger/OpenAPI

---

##  User Roles

| Role | Description |
|---|---|
| **USER** | Browse, read, rent, review books |
| **AUTHOR** | Submit books, track performance metrics |
| **ADMIN** | Full system management and analytics |

---

##  Features

### User (Reader)
- OTP-based registration and login (Email)
- Browse, search and filter books (genre, rating, popularity)
- Read books online (secure PDF streaming - view only)
- Rent physical books
- Return book functionality
- Wishlist management
- Ratings and reviews (1-5 stars)
- Personal dashboard (rentals, wishlist, reviews)

### Author
- Apply to become an author (with photo upload)
- Submit book manuscripts (PDF)
- Edit submissions before approval
- Track submission status
- View performance metrics (reads, rentals, ratings, reviews)

### Admin
- Approve/reject author applications
- Add/edit/delete books manually (with PDF upload)
- Approve/reject book submissions
- Manage inventory (auto-updates on dispatch/return)
- Moderate reviews
- View all users and authors
- Analytics dashboard (overview, books, author insights)
- Manage rental lifecycle (dispatch, complete return)
- Automated email notifications

---

##  Rental Lifecycle
```
REQUESTED → DISPATCHED → RETURN_INITIATED → COMPLETED
```

| Step | Who | Action |
|---|---|---|
| Request | User | Clicks Rent Book |
| Dispatch | Admin | Marks as Dispatched |
| Return | User | Clicks Return Book |
| Complete | Admin | Confirms receipt |

---

##  Database Schema

See [`schema.sql`](./backend/schema.sql) for complete database schema.

### Tables
- `users` — All system users
- `otps` — OTP verification records
- `authors` — Author profiles and approval status
- `books` — Book catalog with metadata
- `book_submissions` — Author book submissions
- `wishlists` — User wishlists
- `reviews` — Book ratings and reviews
- `rentals` — Rental lifecycle management

---

##  Security

- OTP-based onboarding (5 min expiry)
- JWT authentication (1hr expiry)
- Role-based access control (USER, AUTHOR, ADMIN)
- Secure PDF streaming (no download)
- Token validation on all protected routes

---

##  API Documentation

- **Swagger UI:** `http://localhost:5000/api-docs`
- **Postman Collection:** [`postman/postman_collection.json`](./postman/postman_collection.json)

### API Groups
| Group | Base URL |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Books | `/api/books` |
| Authors | `/api/authors` |
| Rentals | `/api/rentals` |
| Reviews | `/api/reviews` |
| Wishlist | `/api/wishlist` |
| Analytics | `/api/admin/analytics` |

---

##  Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

### 1. Clone Repositories
```bash
git clone https://github.com/Pratikmalunjkar/library-management-backend
git clone https://github.com/Pratikmalunjkar/library-management-frontend
```

### 2. Setup Database
```bash
# Create database in PostgreSQL
createdb library_management

# Run schema
psql -d library_management -f schema.sql
```

### 3. Setup Backend
```bash
cd library-management-backend
npm install

# Create .env file
cp .env.example .env
# Fill in your values in .env

npm run dev
```

### 4. Setup Frontend
```bash
cd library-management-frontend
npm install
npm start
```

### 5. Access Application
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Swagger | http://localhost:5000/api-docs |

---

##  Environment Variables
```env
# Backend .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=library_management

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
ADMIN_EMAIL=admin@gmail.com

PORT=5000
```

---

##  Project Structure
```
library-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         → DB, Swagger config
│   │   ├── middleware/     → Auth, Role, Upload
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── books/
│   │   │   ├── authors/
│   │   │   ├── rentals/
│   │   │   ├── reviews/
│   │   │   ├── wishlist/
│   │   │   └── analytics/
│   │   └── utils/
│   ├── storage/books/      → Uploaded PDFs
│   ├── schema.sql
│   ├── SOLID.md
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── README.md
└── postman/
    └── postman_collection.json
```

---

##  SOLID Principles

See [`backend/SOLID.md`](./backend/SOLID.md) for detailed implementation.

| Principle | Implementation |
|---|---|
| **S** - Single Responsibility | Separate controller, service, routes per module |
| **O** - Open/Closed | `authorizeRoles()` middleware extensible without modification |
| **L** - Liskov Substitution | Consistent service function contracts |
| **I** - Interface Segregation | Separate route files per module |
| **D** - Dependency Inversion | Controllers depend on service abstractions |

---

## 📊 Analytics Dashboard

### System Overview
- Total Users, Authors, Books
- Active Rentals, Overdue Rentals

### Book Analytics
- Most Read, Most Rented
- Most Wishlisted, Highest Rated

### Author Insights
- Top Performing Authors
- Books, Reads, Rentals per Author

---

##  BRD Compliance

| Section | Status |
|---|---|
| OTP Authentication | ✅ |
| JWT + RBAC | ✅ |
| Book Management | ✅ |
| Secure PDF Streaming | ✅ |
| Rental Lifecycle | ✅ |
| Wishlist | ✅ |
| Ratings & Reviews | ✅ |
| Author Onboarding | ✅ |
| Admin Analytics | ✅ |
| Email Notifications | ✅ |
| Responsive UI | ✅ |
| SOLID Principles | ✅ |
| Swagger + Postman | ✅ |
| Custom CSS Only | ✅ |
 Deployment on Docker

---

## 👨 Developer

**Pratik Malunjkar**
