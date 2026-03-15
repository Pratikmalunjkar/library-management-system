import apiClient from "./apiClient";

export const requestOtp = async (payload) => {
  const response = await apiClient.post("/auth/request-otp", payload);
  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await apiClient.post("/auth/verify-otp", payload);
  return response.data;
};