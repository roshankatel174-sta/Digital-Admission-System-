import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Colleges
export const getColleges = (params) => API.get('/colleges', { params });
export const getCollege = (id) => API.get(`/colleges/${id}`);
export const createCollege = (data) => API.post('/colleges', data);
export const updateCollege = (id, data) => API.put(`/colleges/${id}`, data);
export const deleteCollege = (id) => API.delete(`/colleges/${id}`);

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Applications
export const getApplications = (params) => API.get('/applications', { params });
export const getMyApplications = () => API.get('/applications/my');
export const getApplication = (id) => API.get(`/applications/${id}`);
export const createApplication = (data) => API.post('/applications', data);
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);

// Documents
export const uploadDocument = (formData) => API.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyDocuments = () => API.get('/documents/my');
export const getAllDocuments = () => API.get('/documents');
export const verifyDocument = (id, data) => API.put(`/documents/${id}/verify`, data);

// Payments
export const createPayment = (data) => API.post('/payments', data);
export const getMyPayments = () => API.get('/payments/my');
export const getAllPayments = () => API.get('/payments');

// Messages
export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = () => API.get('/messages');
export const replyMessage = (data) => API.post('/messages/reply', data);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');

// Reports
export const getDashboardStats = () => API.get('/reports/dashboard');
export const getStudentDashboard = () => API.get('/reports/student-dashboard');

// Users
export const getAllStudents = () => API.get('/users/students');
export const deleteStudent = (id) => API.delete(`/users/students/${id}`);
export const createAdmin = (data) => API.post('/users/admins', data);

// Settings
export const getSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/settings', data);

// Reviews
export const getCollegeReviews = (id) => API.get(`/reviews/college/${id}`);
export const addCollegeReview = (id, data) => API.post(`/reviews/college/${id}`, data);

export default API;
