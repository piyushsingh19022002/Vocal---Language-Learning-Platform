import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API 
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // OTP verification - no token returned, user needs to verify first
  return response.data;
};
export const question=async(data)=>{
  console.log(data);
  
  const response=await api.post('/question/fetchanswer',data);
  console.log(response);
  return response.data;
}

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  localStorage.setItem('email',userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const loginWithGoogle = async (tokenId, userInfo = null) => {
  const response = await api.post('/auth/google', { tokenId, userInfo });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// OTP Verification API
export const verifyOTP = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const resendOTP = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

// Admin API
export const getAdminSummary = async () => {
  const response = await api.get('/admin/summary');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const setUserBlocked = async (userId, blocked) => {
  const response = await api.patch(`/admin/users/${userId}/block`, { blocked });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminCourses = async () => {
  const response = await api.get('/admin/courses');
  return response.data;
};

export const createAdminCourse = async (courseData) => {
  const response = await api.post('/admin/courses', courseData);
  return response.data;
};

export const updateAdminCourse = async (courseId, updates) => {
  const response = await api.put(`/admin/courses/${courseId}`, updates);
  return response.data;
};

export const deleteAdminCourse = async (courseId) => {
  const response = await api.delete(`/admin/courses/${courseId}`);
  return response.data;
};

export const getAdminListeningLessons = async () => {
  const response = await api.get('/admin/listening-lessons');
  return response.data;
};

export const deleteAdminListeningLesson = async (lessonId) => {
  const response = await api.delete(`/admin/listening-lessons/${lessonId}`);
  return response.data;
};

export const getAdminContactMessages = async () => {
  const response = await api.get('/admin/contact-messages');
  return response.data;
};

export const getAdminContactMessage = async (id) => {
  const response = await api.get(`/admin/contact-messages/${id}`);
  return response.data;
};

export const markContactMessageRead = async (id) => {
  const response = await api.patch(`/admin/contact-messages/${id}/read`);
  return response.data;
};

// Courses API
export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Lessons API
export const getLessons = async (courseId) => {
  const response = await api.get(`/lessons?courseId=${courseId}`);
  return response.data;
};

export const getLesson = async (id) => {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
};

// Listening Lessons API
export const getListeningLessons = async () => {
  const response = await api.get('/listening');
  return response.data;
};

export const getListeningLesson = async (id) => {
  const response = await api.get(`/listening/${id}`);
  return response.data;
};

export const textToSpeech = async (text, languageCode = 'en-US') => {
  const response = await api.post('/tts', { text, languageCode });
  return response.data; // expected to contain base64 mp3
};

// Vocabulary API
export const getVocabulary = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/vocabulary?${params}`);
  return response.data;
};

export const getVocabularyWord = async (id) => {
  const response = await api.get(`/vocabulary/${id}`);
  return response.data;
};
export const saveScoreData=async(finalScore)=>{

  try{
    const token=localStorage.getItem("token");
    const decode=jwtDecode(token);
    console.log(decode);
  const res=await api.post("/save/score",{
    score:finalScore,
    id:decode.id,
  });
  console.log("Saved: ",res.data);
  }
  catch(err){
    console.log("Error Saving score: ",err);
  }
}

export const createVocabulary = async (vocabularyData) => {
  const response = await api.post('/vocabulary', vocabularyData);
  return response.data;
};

export const createVocabularyBulk = async (words, language = 'French') => {
  const response = await api.post('/vocabulary/bulk', { words, language });
  return response.data;
};

export const parseSentence = async (sentence, language = 'French') => {
  const response = await api.post('/vocabulary/parse-sentence', { sentence, language });
  return response.data;
};

export const translateWord = async (word, sourceLang, targetLang) => {
  const response = await api.post('/translate', { word, sourceLang, targetLang });
  return response.data.translatedText;
};

export const updateVocabulary = async (id, updates) => {
  const response = await api.put(`/vocabulary/${id}`, updates);
  return response.data;
};

export const deleteVocabulary = async (id) => {
  const response = await api.delete(`/vocabulary/${id}`);
  return response.data;
};

export const deleteVocabularyBulk = async (ids) => {
  const response = await api.delete('/vocabulary', { data: { ids } });
  return response.data;
};

export const searchVocabulary = async (query, language) => {
  const params = new URLSearchParams({ q: query });
  if (language) params.append('language', language);
  const response = await api.get(`/vocabulary/search?${params}`);
  return response.data;
};

export const getVocabularyStats = async (language, userId) => {
  const params = new URLSearchParams();
  if (language) params.append('language', language);
  if (userId) params.append('userId', userId);
  const response = await api.get(`/vocabulary/stats/summary?${params}`);
  return response.data;
};

// Contact API
export const submitContactForm = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

export default api;

