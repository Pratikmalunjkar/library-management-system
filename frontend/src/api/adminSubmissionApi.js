import apiClient from "./apiClient";

export const getPendingSubmissions = async () => {
  const res = await apiClient.get("/authors/submissions/pending");
  return res.data;
};

export const approveSubmission = async (id) => {
  const res = await apiClient.patch(`/authors/submissions/${id}/approve`);
  return res.data;
};

export const rejectSubmission = async (id, adminComment) => {
  const res = await apiClient.patch(`/authors/submissions/${id}/reject`, {
    admin_comment: adminComment
  });
  return res.data;
};