import apiClient from "./apiClient";

// ✅ Request rental
export const requestRental = async (bookId) => {
  const response = await apiClient.post("/rentals/request", {
    book_id: bookId,
  });
  return response.data;
};

// ✅ Get my rentals
export const getMyRentals = async () => {
  const response = await apiClient.get("/rentals/me");
  return response.data;
};

export const initiateReturn = async (rentalId) => {
  const response = await apiClient.patch(`/rentals/${rentalId}/return`);
  return response.data;
};

// ✅ Handle return (frontend helper)
export const handleReturn = async (rentalId, fetchRentals) => {
  try {
    const data = await initiateReturn(rentalId);
    alert(data.message || "Return initiated");
    if (fetchRentals) {
      fetchRentals(); // refresh list after return
    }
  } catch (error) {
    alert(error.response?.data?.message || "Return failed");
  }
};
