# SOLID Principles Implementation

## S - Single Responsibility Principle
Each module has one responsibility:
- `auth.controller.js` → only handles HTTP request/response for auth
- `auth.service.js` → only handles business logic for auth
- `auth.routes.js` → only handles route definitions
- Same pattern followed for books, rentals, authors, reviews, wishlist, analytics

## O - Open/Closed Principle
- The `authorizeRoles(...allowedRoles)` middleware in `roleMiddleware.js` is open for extension (add new roles) but closed for modification
- New roles can be added without changing existing middleware logic
- Example: `authorizeRoles("ADMIN", "AUTHOR")` extends behavior without modifying core

## L - Liskov Substitution Principle
- All service functions follow consistent patterns — they accept parameters, perform DB operations, and return data or throw errors
- Controllers can call any service function and expect the same behavior contract
- Example: `requestRental`, `dispatchRental`, `completeRental` all follow same input/output contract

## I - Interface Segregation Principle
- Each module has its own dedicated route file, avoiding one large route file
- `auth.routes.js` only exposes auth endpoints
- `book.routes.js` only exposes book endpoints
- `rental.routes.js` only exposes rental endpoints
- Users are not exposed to endpoints they don't need

## D - Dependency Inversion Principle
- Controllers depend on service abstractions, not direct DB calls
- Example: `rental.controller.js` calls `rentalService.requestRental()` instead of directly querying the DB
- `db.js` is a single abstracted pool module — all modules depend on this abstraction, not on a specific DB implementation
- `email.js` and `jwt.js` are utility abstractions used across modules