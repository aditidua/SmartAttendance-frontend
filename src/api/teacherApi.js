import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const createClass = async (teacherId, className, token) => {
  const response = await axios.post(
    `${BASE_URL}/teacher/createClass`,
    null,
    {
      params: { id: teacherId, className },
      headers: authHeader(token),
    }
  );
  return response.data;
};

export const fetchClassAttendance = async (classId, token) => {
  const response = await axios.get(
    `${BASE_URL}/teacher/fetchClassAttendance`,
    {
      params: { classId },
      headers: authHeader(token),
    }
  );
  return response.data;
};

