import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Complete registration for new users (after Google login)
export const completeRegistration = async (email, role, imageFile) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("role", role);
  formData.append("image", imageFile);

  const response = await axios.post(
    `${BASE_URL}/api/users/complete-registration`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data; // returns JWT token
};

// Delete a user by email
export const deleteUser = async (email, token) => {
  const response = await axios.delete(`${BASE_URL}/api/users/delete`, {
    params: { email },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};