-- =============================================
-- BOOK LIBRARY MANAGEMENT SYSTEM
-- Database Schema
-- =============================================

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT,
    user_role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OTPs Table
CREATE TABLE otps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    otp_code VARCHAR(10),
    expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Authors Table
CREATE TABLE authors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    biography TEXT,
    qualifications TEXT,
    experience TEXT,
    profile_photo_url TEXT,
    rejection_reason TEXT,
    approval_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Books Table
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES authors(id) ON DELETE SET NULL,
    author_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(50),
    description TEXT,
    isbn VARCHAR(20) UNIQUE,
    publication_date DATE,
    cover_image_url TEXT,
    pdf_storage_key TEXT,
    total_copies INT DEFAULT 0,
    available_copies INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    wishlist_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    rental_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Book Submissions Table
CREATE TABLE book_submissions (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES authors(id) ON DELETE CASCADE,
    title VARCHAR(255),
    genre VARCHAR(50),
    description TEXT,
    isbn VARCHAR(20),
    publication_date DATE,
    cover_image_url TEXT,
    manuscript_storage_key TEXT,
    admin_comment TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Wishlists Table
CREATE TABLE wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Reviews Table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    moderated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Rentals Table
CREATE TABLE rentals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    rental_date TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,
    returned_at TIMESTAMP,
    return_requested_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'REQUESTED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_otps_user_id ON otps(user_id);
CREATE INDEX idx_authors_user_id ON authors(user_id);
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_book_submissions_author_id ON book_submissions(author_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_status ON rentals(status);