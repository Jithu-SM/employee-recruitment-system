# AI-Based Employee Recruitment System

An AI-powered recruitment platform that automates **resume parsing**, matches candidates to jobs using **NLP/ML**, and allows recruiters to manage applications with status tracking.

The system is built with **Django REST Framework** for the backend and **React.js** for the frontend.

<div align="center">

[![wakatime](https://wakatime.com/badge/user/e952d4d7-b591-4f25-9cc5-372f864cae94/project/df2f9293-2278-4594-8392-c00568fea153.svg)](https://wakatime.com/badge/user/e952d4d7-b591-4f25-9cc5-372f864cae94/project/df2f9293-2278-4594-8392-c00568fea153)

</div>

---

## 🔧 Features

### Candidate

* Register/login with **JWT Authentication**
* Upload resume (PDF)
* Parsed resume data displayed on dashboard
* Job suggestions using **TF-IDF + Cosine Similarity**
* Apply to jobs directly from dashboard
* Track **application status** (e.g., Pending, Accepted, Rejected)

### Recruiter

* Post job listings
* View matched applicants with ranking
* Manage applications (**Accept/Reject**)
* Application status updates reflected on candidate dashboard *(in progress)*

### Admin

* Manage users, resumes, jobs, and applications
* Monitor system activity
* Generate reports *(planned)*

---

## 🧰 Technologies Used

* **Backend:** Django, Django REST Framework
* **Frontend:** React.js (Hooks, React Router)
* **Database:** PostgreSQL
* **AI/NLP:** spaCy, scikit-learn (TF-IDF + cosine similarity)
* **Authentication:** JWT (Django SimpleJWT)
* **Others:** psycopg2-binary, axios

---

## 🚀 Getting Started

### Backend Setup (Django)

1. Clone the repository:

   ```bash
   git clone https://github.com/jithu-sm/employee-recruitment-system.git
   cd employee-recruitment-system
   ```

2. Create and activate virtual environment:

   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure PostgreSQL in `settings.py`.

5. Run migrations and start server:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup (React)

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run frontend development server:

   ```bash
   npm start
   ```

---

## 📂 Project Structure

```
employee-recruitment-system/
│
├── recruitment_system/     # BACKEND
│   ├── users/              # Custom user model & JWT auth
│   ├── resumes/            # Resume upload + parsing logic
│   ├── jobs/               # Job posting & matching (TF-IDF)
│   ├── applications/       # Application model + status tracking
│   ├── recruitment_system/ # Django project settings
│   └── manage.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard, Login, Register, Recruiter views
│   │   ├── services/       # API integration (axios, JWT handling)
│   │   ├── styles/         # CSS files
│   │   └── App.js
│   └── package.json
│
├── requirements.txt
└── README.md
```

---

## 📌 Current Stage

* ✅ Candidate side: Resume parsing, job suggestions, applying, and application status tracking
* ✅ JWT authentication integrated (login & token decode on frontend)
* ✅ Recruiter can post jobs and view applicants ranked by match score
* 🚧 Recruiter-side application status updates (accept/reject workflow) in progress
* 🚧 Admin dashboard and reporting planned

---
