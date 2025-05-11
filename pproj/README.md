# Online Learning Portal

A comprehensive online learning platform where instructors can create multimedia courses and students can enroll, learn, and interact.

## Features

- Course Management (videos, PDFs, quizzes)
- Student Enrollment & Progress Tracking
- Auto-graded Quizzes
- Discussion Boards
- Course Categorization
- User Authentication & Authorization

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Django
- Python
- Node.js

### Database
- MongoDB

## Project Structure

```
online-learning-portal/
├── frontend/           # Frontend code
├── backend/           # Django backend
├── node_server/       # Node.js server
└── docs/             # Documentation
```

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. Set up the Node.js server:
   ```bash
   cd node_server
   npm install
   npm start
   ```

4. Open the frontend/index.html in your browser

## Environment Variables

Create a `.env` file in the backend directory with:
```
SECRET_KEY=your_secret_key
MONGODB_URI=your_mongodb_uri
```

## License

MIT License 