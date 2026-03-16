# Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose v2+

## Steps to Run with Docker

### 1. Clone the repository
```bash
git clone https://github.com/Pratikmalunjkar/library-management-system
cd library-management-system
```

### 2. Update environment variables
Open `docker-compose.yml` and update these values:
- `JWT_SECRET` → your secret key
- `EMAIL_USER` → your gmail
- `EMAIL_PASS` → your gmail app password
- `ADMIN_EMAIL` → admin gmail

### 3. Build and Start all services
```bash
docker compose up --build
```

### 4. Access the application
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/api-docs |
| Database | localhost:5432 |

### 5. Stop the application
```bash
docker compose down
```

### 6. Stop and remove all data
```bash
docker compose down -v
```

## Services
- **db** — PostgreSQL 15 database
- **backend** — Node.js Express API (port 5000)
- **frontend** — React app served via Nginx (port 3000)