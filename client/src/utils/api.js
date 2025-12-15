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
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
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

export default api;

