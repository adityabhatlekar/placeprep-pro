const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Auth APIs
export const registerUser = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const loginUser = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

// Exam APIs
export const getAllExams = () =>
  fetch(`${BASE_URL}/exams`, {
    headers: getHeaders()
  }).then(res => res.json());

export const getExamById = (examId) =>
  fetch(`${BASE_URL}/exams/${examId}`, {
    headers: getHeaders()
  }).then(res => res.json());

export const createExam = (data) =>
  fetch(`${BASE_URL}/exams/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());

export const addQuestion = (examId, data) =>
  fetch(`${BASE_URL}/exams/${examId}/questions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());

// Submission APIs
export const submitExam = (examId, data) =>
  fetch(`${BASE_URL}/submissions/${examId}/submit`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());

export const getMySubmissions = () =>
  fetch(`${BASE_URL}/submissions/my`, {
    headers: getHeaders()
  }).then(res => res.json());

export const getResult = (examId) =>
  fetch(`${BASE_URL}/submissions/${examId}/result`, {
    headers: getHeaders()
  }).then(res => res.json());

export const getLeaderboard = (examId) =>
  fetch(`${BASE_URL}/submissions/${examId}/leaderboard`, {
    headers: getHeaders()
  }).then(res => res.json());