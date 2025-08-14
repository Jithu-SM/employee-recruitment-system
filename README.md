# AI-Based Employee Recruitment System

This is an AI-powered recruitment system that automates resume parsing and matches candidates to job descriptions using Natural Language Processing (NLP) and Machine Learning (ML). The system is built using Django for the backend and React.js for the frontend.

<div align="center">

[![wakatime](https://wakatime.com/badge/user/e952d4d7-b591-4f25-9cc5-372f864cae94/project/df2f9293-2278-4594-8392-c00568fea153.svg)](https://wakatime.com/badge/user/e952d4d7-b591-4f25-9cc5-372f864cae94/project/df2f9293-2278-4594-8392-c00568fea153)

</div>

## 🔧 Features

### Candidate
- Register and upload resume (PDF format)
- Parsed resume data displayed on profile
- Job suggestions based on parsed data
- Track application status

### Recruiter
- Post job listings
- View applicants ranked by match score
- Accept/Reject applications and send notifications

### Admin
- Full access to manage users, jobs, and applications
- Monitor system activity and generate reports

## 🧰 Technologies Used

- **Backend:** Django, Django REST Framework
- **Frontend:** React.js
- **Database:** PostgreSQL
- **AI/NLP:** pyresparser, spaCy, scikit-learn (TF-IDF + cosine similarity)
- **Others:** psycopg2-binary

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

4. Configure your PostgreSQL database in `settings.py`.

5. Run migrations and start the server:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver
   ```

## 📂 Project Structure (Backend)

```
employee-recruitment-system/
│
├── users/          # Custom user model and authentication
├── resumes/        # Resume upload and parsing logic
├── jobs/           # Job posting and matching
├── recruitment_system/  # Django project settings
└── manage.py
```
