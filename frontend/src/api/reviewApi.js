// src/api/reviewApi.js
import apiClient from "./apiClient";

// Get all reviews for a book
export const getBookReviews = async (bookId) => {
  const response = await apiClient.get(`/reviews/book/${bookId}`);
  return response.data;
};

// Add a new review
export const addReview = async (bookId, rating, comment) => {
  const response = await apiClient.post("/reviews", {
    book_id: bookId,
    rating,
    comment,
  });
  return response.data;
};
