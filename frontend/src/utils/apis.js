import axios from "axios";

const API_URL = "https://to-do-app-backend-yyge.onrender.com";

export const register = (userData) => {
  return axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
  });
};

export const login = (loginData) => {
  return axios.post(`${API_URL}/login`, loginData, { withCredentials: true });
};

export const logOutUser = () => {
  return axios.get(`${API_URL}/logout`, { withCredentials: true });
};

export const fetchTasks = () => {
  return axios.get(`${API_URL}/tasks`, { withCredentials: true });
};

export const getCompletedTasks = () => {
  return axios.get(`${API_URL}/tasks/completed`, { withCredentials: true });
};

export const getIncompletedTasks = () => {
  return axios.get(`${API_URL}/tasks/incompleted`, { withCredentials: true });
};

export const createTask = (taskData) => {
  return axios.post(`${API_URL}/task`, taskData, { withCredentials: true });
};

export const updateTask = (id, updatedTask) => {
  return axios.put(`${API_URL}/updatecontent/${id}`, updatedTask, { withCredentials: true });
};

export const updateTaskStatus = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/updatestatus/${id}`,
      null,
      { withCredentials: true }
    );
    return response.data; // Return the data directly
  } catch (error) {
    throw error; // Throw the error to handle it in the calling function
  }
};

export const deleteTask = (id) => {
  return axios.delete(`${API_URL}/task/${id}`, { withCredentials: true });
};

export const updateProfile = (updates) => {
  return axios.patch(`${API_URL}/user`, updates, {
    withCredentials: true,
  });
};