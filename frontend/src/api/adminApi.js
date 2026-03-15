import apiClient from "./apiClient";
import axios from "axios";   // ✅ moved to top

const API = "http://localhost:5000/api";

// Author approvals
export const getAuthorApplications = async () => {
  const res = await apiClient.get("/authors/pending");
  return res.data;
};

export const approveAuthor = async (authorId) => {
  const res = await apiClient.patch(`/authors/${authorId}/approve`);
  return res.data;
};

export const rejectAuthor = async (authorId) => {
  const res = await apiClient.patch(`/authors/${authorId}/reject`);
  return res.data;
};

// Admin Rentals
export const getAllRentals = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/rentals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const dispatchRental = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.patch(`${API}/rentals/${id}/dispatch`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
