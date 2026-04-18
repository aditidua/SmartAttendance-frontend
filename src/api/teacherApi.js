import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// Create a new class
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

// Fetch all classes for a teacher
export const fetchTeacherClasses = async (teacherId, token) => {
  const response = await axios.get(
    `${BASE_URL}/teacher/fetchClasses`,
    {
      params: { teacherId },
      headers: authHeader(token),
    }
  );
  return response.data;
};
export const openAttendance = async (classId, token) => {
  await axios.post(`${BASE_URL}/teacher/openAttendance`, null, {
    params: { classId },
    headers: authHeader(token),
  });
};

export const closeAttendance = async (classId, token) => {
  await axios.post(`${BASE_URL}/teacher/closeAttendance`, null, {
    params: { classId },
    headers: authHeader(token),
  });
};

export const getAttendanceStatus = async (classId, token) => {
  const response = await axios.get(`${BASE_URL}/teacher/attendanceStatus`, {
    params: { classId },
    headers: authHeader(token),
  });
  return response.data;
};
export const fetchClassAttendance = async (classId, token) => {
  const response = await axios.get(`${BASE_URL}/teacher/fetchClassAttendance`, {
    params: { classId },
    headers: authHeader(token),
  });
  return response.data;
};
export const postAssignment = async (classId, description, deadline, token) => {
  await axios.post(`${BASE_URL}/teacher/postAssignment`, null, {
    params: { classId, description, deadline },
    headers: authHeader(token),
  });
};
