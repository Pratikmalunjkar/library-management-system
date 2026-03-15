import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import BooksPage from "./pages/books/BooksPage";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import ReadBookPage from "./pages/books/ReadBookPage";

import WishlistPage from "./pages/wishlist/WishlistPage";
import RentalsPage from "./pages/rentals/RentalsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRentalsPage from "./pages/admin/AdminRentalsPage";   // ✅ Added import

import AuthorDashboard from "./pages/authors/AuthorDashboard";
import ApplyAuthorPage from "./pages/authors/ApplyAuthorPage";

import AuthorApprovalsPage from "./pages/admin/AuthorApprovalsPage";
import SubmitBookPage from "./pages/authors/SubmitBookPage";
import SubmissionApprovalsPage from "./pages/admin/SubmissionApprovalsPage";
import AdminBooksPage from "./pages/admin/AdminBooksPage";

import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAuthorsPage from "./pages/admin/AdminAuthorsPage";
import UserDashboard from "./pages/UserDashboard";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BooksPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/books/:id"
          element={
            <PrivateRoute>
              <BookDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/books/:id/read"
          element={
            <PrivateRoute>
              <ReadBookPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishlistPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/rentals"
          element={
            <PrivateRoute>
              <RentalsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/rentals"
          element={
            <PrivateRoute>
              <AdminRentalsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/author"
          element={
            <PrivateRoute>
              <AuthorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/apply-author"
          element={
            <PrivateRoute>
              <ApplyAuthorPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/authors"
          element={
            <PrivateRoute>
              <AuthorApprovalsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/author/submit-book"
          element={
            <PrivateRoute>
              <SubmitBookPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/submissions"
          element={
            <PrivateRoute>
              <SubmissionApprovalsPage />
            </PrivateRoute>
          }
        />
        <Route path="/admin/books" element={<PrivateRoute><AdminBooksPage /></PrivateRoute>} />
        <Route path="/admin/reviews" element={<PrivateRoute><AdminReviewsPage /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute><AdminUsersPage /></PrivateRoute>} />
<Route path="/admin/authors-list" element={<PrivateRoute><AdminAuthorsPage /></PrivateRoute>} />

<Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
