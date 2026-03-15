import apiClient from "./apiClient";

export const applyForAuthor = async (data) => {
  const response = await apiClient.post("/authors/apply", data);
  return response.data;
};