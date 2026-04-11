import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// Join a class using 4-digit code
export const joinClass = async (studentId, classCode, token) => {
  const response = await axios.post(
    `${BASE_URL}/student/joinClass`,
    null,
    {
      params: { studentId, classCode },
      headers: authHeader(token),
    }
  );
  return response.data;
};

// Mark attendance with face image + location + time
export const markAttendance = async (studentId, classId, imageFile, token) => {
  const formData = new FormData();
  formData.append("StudentId", studentId);
  formData.append("classId", classId);
  formData.append("image", imageFile);

  const response = await axios.post(
    `${BASE_URL}/student/markAttendance`,
    formData,
    {
      headers: {
        ...authHeader(token),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Fetch student profile + attendance for a class
export const fetchStudentDetails = async (studentId, classId, token) => {
  const response = await axios.get(
    `${BASE_URL}/student/fetchDetails`,
    {
      params: { studentId, classId },
      headers: authHeader(token),
    }
  );
  return response.data;
};
// Get all classes a student is enrolled in
export const getEnrolledClasses = async (studentId, token) => {
  const response = await axios.get(
    `${BASE_URL}/student/getEnrolledClasses`,
    {
      params: { studentId },
      headers: authHeader(token),
    }
  );
  return response.data;
};