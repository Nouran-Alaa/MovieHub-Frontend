# Movie Watchlist App

A full-stack web application for managing your personal movie watchlist with a sleek dark theme inspired by Netflix. Built with Django REST Framework for the backend and React with Tailwind CSS for the frontend.

## 🎯 Features

### Core Features
- ✅ User Authentication (Register/Login with JWT)
- ✅ Add, Edit, and Delete Movies
- ✅ Mark Movies as Watched/Unwatched
- ✅ Filter Movies by Genre and Status
- ✅ Search Movies by Title
- ✅ Dashboard with Statistics
  - Total movies count
  - Watched/Unwatched counts
  - Movies watched this month
  - Movies by genre breakdown
  - Recently watched movies
- ✅ Integration with OMDB API for automatic movie details
- ✅ Pagination for movie list
- ✅ Dark theme UI with red accents

### Technical Features
- JWT Authentication with token refresh
- RESTful API with Django REST Framework
- Responsive UI with Tailwind CSS
- API Documentation (Swagger/ReDoc)
- CORS enabled for separate frontend/backend deployment
- Custom dark theme with Netflix-inspired design

## 🏗️ Project Structure

```
movie-watchlist/
├── backend/                 # Django REST API
│   ├── backend/            # Project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── movies/             # Movies app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── admin.py
│   ├── requirements.txt
│   ├── manage.py
│   └── .env
│
└── frontend/               # React App
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── Layout.jsx
    │   │   ├── MovieCard.jsx
    │   │   ├── MovieForm.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/          # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Movies.jsx
    │   ├── api.js          # API client
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── .env
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd movie-watchlist/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create .env file**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
OMDB_API_KEY=your-omdb-api-key-here
```

Get your free OMDB API key from: https://www.omdbapi.com/apikey.aspx

5. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run the development server**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

4. **Run the development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, access the API documentation:

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

### Main API Endpoints

#### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user

#### Movies
- `GET /api/movies/` - List all movies (with filters)
- `POST /api/movies/` - Create new movie
- `GET /api/movies/{id}/` - Get movie details
- `PATCH /api/movies/{id}/` - Update movie
- `DELETE /api/movies/{id}/` - Delete movie
- `POST /api/movies/{id}/mark_watched/` - Mark as watched
- `POST /api/movies/{id}/mark_unwatched/` - Mark as unwatched
- `GET /api/movies/stats/` - Get dashboard statistics

#### External API
- `GET /api/search-movie/?title={title}` - Search movie from OMDB

### Query Parameters for Movies List
- `status` - Filter by status (watched/unwatched)
- `genre` - Filter by genre
- `search` - Search by title

## 🧪 Testing the API

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

**Create Movie (with token):**
```bash
curl -X POST http://localhost:8000/api/movies/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Inception",
    "genre": "sci-fi",
    "release_year": 2010,
    "status": "watched"
  }'
```

## 🎨 Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **Simple JWT** - JWT authentication
- **drf-yasg** - API documentation
- **django-cors-headers** - CORS support
- **SQLite** - Database (default)

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications
- **Vite** - Build tool

## 📦 Deployment

### Backend Deployment

1. **Update settings for production**
```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
```

2. **Add Procfile**
```
web: gunicorn backend.wsgi
```

3. **Set environment variables** on your platform
- SECRET_KEY
- DATABASE_URL (if using PostgreSQL)
- ALLOWED_HOSTS
- CORS_ALLOWED_ORIGINS
- OMDB_API_KEY

### Frontend Deployment

1. **Update .env for production**
```env
VITE_API_URL=https://your-backend-url.com/api
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy the `dist` folder** to your hosting platform

## 🔒 Security Notes

- Never commit `.env` files to version control
- Change `SECRET_KEY` in production
- Use strong passwords
- Enable HTTPS in production
- Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` for production domains

## 🐛 Troubleshooting

### Backend Issues

**CORS Errors:**
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS` in backend `.env`

**Database Errors:**
- Run migrations: `python manage.py migrate`

**Import Errors:**
- Reinstall requirements: `pip install -r requirements.txt`

### Frontend Issues

**API Connection Errors:**
- Verify `VITE_API_URL` in frontend `.env`
- Ensure backend is running

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`

## 🙏 Acknowledgments

- OMDB API for movie data
- Django REST Framework documentation
- React documentation
- Tailwind CSS
