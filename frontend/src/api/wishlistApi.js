import apiClient from "./apiClient";

export const addToWishlist = async (bookId) => {
  const response = await apiClient.post("/wishlist", { book_id: bookId });
  return response.data;
};

export const getWishlist = async () => {
  const response = await apiClient.get("/wishlist");
  return response.data;
};

export const removeFromWishlist = async (bookId) => {
  const response = await apiClient.delete(`/wishlist/${bookId}`);
  return response.data;
};