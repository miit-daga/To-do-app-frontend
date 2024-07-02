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
  return axios.get(`${API_URL}/tasks`);
};

export const getCompletedTasks = () => {
  return axios.get(`${API_URL}/tasks/completed`);
};

export const getIncompletedTasks = () => {
  return axios.get(`${API_URL}/tasks/incompleted`);
};

export const createTask = (taskData) => {
  return axios.post(`${API_URL}/task`, taskData);
};

export const updateTask = (id, updatedTask) => {
  return axios.put(`${API_URL}/updatecontent/${id}`, updatedTask);
};

export const updateTaskStatus = (id) => {
  return axios.put(`${API_URL}/updatestatus/${id}`);
};

export const deleteTask = (id) => {
  return axios.delete(`${API_URL}/task/${id}`);
};
