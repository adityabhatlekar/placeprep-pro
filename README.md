# PlacePrep Pro 🎓

A full-stack Engineering Placement Test SaaS platform built with the MERN stack. Designed to simulate real company placement drives with timed exams, auto-grading, and scheduled result releases.

---

## 🚀 Live Demo

- **Frontend:** https://placeprep-pro.vercel.app
- **Backend API:** https://placeprep-backend.onrender.com

---

## 📌 Features

### Student
- Register and login securely with JWT authentication
- View all available placement exams
- Attempt exams with a live countdown timer
- Answer MCQ and Coding questions in Aptitude + Technical sections
- Results locked after submission — auto-released after set time
- View detailed scorecard with section-wise scores, rank and percentile

### Admin
- Create exams with custom duration and result release time
- Add MCQ and Coding questions to Aptitude or Technical sections
- Manage all exams from a dedicated admin dashboard

### Platform
- Role-based access control (Student / Admin)
- Auto-grading of MCQ answers on submission
- Cron job runs every minute to auto-release results
- Rank and percentile calculated on result release
- Dark professional UI theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, CSS-in-JS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Scheduler | node-cron |
| Hosting | Vercel (Frontend), Render (Backend), MongoDB Atlas (DB) |

---

## 📁 Project Structure

```
placeprep-pro/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── examController.js
│   │   └── submissionController.js
│   ├── jobs/
│   │   └── releaseResults.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   └── submissionRoutes.js
│   └── app.js
│
└── frontend/saas-exam/
    └── src/
        ├── components/
        │   └── Sidebar.js
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── StudentDashboard.js
        │   ├── ExamAttempt.js
        │   ├── Scorecard.js
        │   └── AdminDashboard.js
        ├── services/
        │   └── api.js
        └── theme.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Compass (local) or MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/adityabhatlekar/placeprep-pro.git
cd placeprep-pro
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placeprep
JWT_SECRET=placeprep_super_secret_key
RESULT_RELEASE_HOURS=24
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend/saas-exam
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |

### Exams
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/exams/create | Admin |
| POST | /api/exams/:examId/questions | Admin |
| GET | /api/exams | Student + Admin |
| GET | /api/exams/:examId | Student + Admin |

### Submissions
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/submissions/:examId/submit | Student |
| GET | /api/submissions/my | Student |
| GET | /api/submissions/:examId/result | Student |
| GET | /api/submissions/:examId/leaderboard | Student + Admin |

---

## 🗄️ Database Schema

### Users
```
name, email, password (hashed), role (student/admin), timestamps
```

### Exams
```
title, description, duration, releaseAfter, sections (aptitude + technical), createdBy, isActive
```

### Questions
```
examId, section, type (mcq/coding), questionText, options, correctAnswer, marks, codingProblemDetails
```

### Submissions
```
examId, studentId, answers, aptitudeScore, technicalScore, totalScore, totalMarks, status (pending/released), submittedAt, releasedAt, rank, percentile
```

---

## 👤 Default Roles

Create an admin account using Postman:
```json
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@placeprep.com",
  "password": "admin1234",
  "role": "admin"
}
```

Students can register directly from the app at `/register`

---

## 📦 Deployment

| Service | Platform |
|---------|---------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## 👨‍💻 Author

**Aditya Bhatlekar**
- GitHub: [@adityabhatlekar](https://github.com/adityabhatlekar)

---

## 📄 License

This project is for educational purposes.
