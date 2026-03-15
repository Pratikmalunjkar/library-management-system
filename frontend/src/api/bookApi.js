import apiClient from "./apiClient";

export const getAllBooks = async () => {
  const response = await apiClient.get("/books");
  return response.data;
};

export const getBookById = async (id) => {
  const response = await apiClient.get(`/books/${id}`);
  return response.data;
};

export const searchBooks = async (query) => {
  const response = await apiClient.get(`/books/search?q=${query}`);
  return response.data;
};

export const filterBooksByGenre = async (genre) => {
  const response = await apiClient.get(`/books/filter?genre=${genre}`);
  return response.data;
};

export const filterBooksByRating = async (min) => {
  const response = await apiClient.get(`/books/filter/rating?min=${min}`);
  return response.data;
};

export const filterBooksByPopularity = async () => {
  const response = await apiClient.get(`/books/filter/popularity`);
  return response.data;
};
export const updateBook = async (id, data) => {
  const response = await apiClient.put(`/books/${id}`, data);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/books/${id}`);
  return response.data;
};