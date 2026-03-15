# Book Library Management System — Backend

## Tech Stack
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Nodemailer (Email)
- Multer (File Upload)
- Swagger (API Docs)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file in root
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

PORT=5000
```

### 3. Run the Server
```bash
npm start
# or with nodemon
npm run dev
```

### 4. Access API Docs
```
http://localhost:5000/api-docs
```

## Project Structure
```
src/
├── config/         → DB and Swagger config
├── middleware/     → Auth, Role, Upload middleware
├── modules/
│   ├── auth/       → OTP + JWT Authentication
│   ├── users/      → User routes + dashboard
│   ├── books/      → Book CRUD + PDF streaming
│   ├── authors/    → Author onboarding + submissions
│   ├── rentals/    → Rental lifecycle management
│   ├── reviews/    → Ratings and reviews
│   ├── wishlist/   → Wishlist management
│   └── analytics/ → Admin analytics
└── utils/          → Email, JWT utilities
```

## API Modules
| Module | Base URL |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Books | `/api/books` |
| Authors | `/api/authors` |
| Rentals | `/api/rentals` |
| Reviews | `/api/reviews` |
| Wishlist | `/api/wishlist` |
| Analytics | `/api/admin/analytics` |

## Roles
| Role | Description |
|---|---|
| USER | Reader — browse, rent, review books |
| AUTHOR | Extended user — submit books, view metrics |
| ADMIN | Full access — manage everything |