import apiClient from "./apiClient";

export const submitBook = async (data) => {
  const res = await apiClient.post("/authors/submissions", data);
  return res.data;
};

export const getMySubmissions = async () => {
  const res = await apiClient.get("/authors/submissions/me");
  return res.data;
};
export const updateBook = async (id, data) => {
  const response = await apiClient.put(`/books/${id}`, data);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/books/${id}`);
  return response.data;
};