# Todo Platform

A production-oriented full-stack Todo application built with **Django REST Framework** and **React + Vite**. The project includes JWT authentication, task management, PostgreSQL, Redis, Celery background processing, Docker, Docker Compose, and Nginx.

The repository contains both the Django backend and React frontend in a single project.

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* PostgreSQL
* Redis
* Celery
* Django Celery Beat
* Gunicorn
* Nginx
* Docker
* Docker Compose

### Frontend

* React
* TypeScript
* Vite
* Axios
* CSS
* Context API

---

## Project Structure

```text
todo-platform/
│
├── accounts/                       # User authentication and account management
├── todos/                          # Todo application
│
├── config/                         # Django project configuration
│   └── settings/
│       ├── base.py
│       ├── development.py
│       └── production.py
│
├── docker/                         # Docker-related configuration
├── nginx/                          # Nginx configuration
│
├── frontend/                       # React + Vite frontend
│   │
│   ├── public/
│   │   ├── avatars/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   ├── client.ts
│   │   │   └── todos.api.ts
│   │   │
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── components/
│   │   │   └── auth/
│   │   │       └── ProtectedRoute.tsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppShell.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── todo.ts
│   │   │
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── manage.py
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

> `node_modules/` and `dist/` are generated directories and should not be committed to the repository.

---

# Features

## Authentication

* User registration
* User login
* JWT authentication
* Access and refresh tokens
* Protected routes
* User account management
* Secure password handling

## Todo Management

* Create todos
* View todos
* Update todos
* Delete todos
* Todo status management
* User-specific todos

## Frontend

* React + TypeScript
* Vite development environment
* Authentication context
* Theme management
* Protected routes
* Axios API client
* Separate API modules
* Dashboard
* Login page
* Registration page
* Responsive UI

## Backend

* Django REST Framework API
* PostgreSQL database
* JWT authentication
* API filtering
* Pagination
* API throttling
* OpenAPI documentation
* Custom exception handling
* Production/development settings separation

## Background Processing

* Redis message broker
* Celery workers
* Celery Beat
* Periodic task scheduling
* Database-backed Celery Beat scheduler

## Production Infrastructure

* Docker
* Docker Compose
* PostgreSQL container
* Redis container
* Gunicorn
* Nginx reverse proxy
* HTTPS configuration
* Production Django settings

---

# Architecture

```text
                    ┌──────────────────┐
                    │      Browser     │
                    │   React + Vite   │
                    └────────┬─────────┘
                             │
                             │ HTTP / HTTPS
                             ▼
                    ┌──────────────────┐
                    │      Nginx       │
                    │ Reverse Proxy     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Django / DRF     │
                    │    Gunicorn      │
                    └──────┬─────┬─────┘
                           │     │
                ┌──────────┘     └──────────┐
                ▼                           ▼
        ┌──────────────┐             ┌──────────────┐
        │  PostgreSQL  │             │    Redis     │
        │   Database   │             │    Broker    │
        └──────────────┘             └──────┬───────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │    Celery    │
                                    │    Worker    │
                                    └──────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │ Celery Beat  │
                                    │  Scheduler   │
                                    └──────────────┘
```

---

# Requirements

For local development without Docker:

* Python 3.x
* Node.js
* npm
* PostgreSQL
* Redis

For Docker-based development:

* Docker
* Docker Compose

---

# Clone the Repository

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Enter the project:

```bash
cd todo-platform
```

---

# Environment Configuration

Create your environment file from the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your local configuration.

Never commit real secrets, passwords, API keys, private certificates, or production environment files.

---

# Backend Setup Without Docker

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install Python dependencies:

```powershell
pip install -r requirements.txt
```

Apply migrations:

```powershell
python manage.py migrate
```

Create an administrator:

```powershell
python manage.py createsuperuser
```

Start Django:

```powershell
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

---

# Frontend Setup Without Docker

Move into the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

The React frontend communicates with the Django REST API.

---

# Frontend Production Build

From the `frontend` directory:

```powershell
npm run build
```

The production build is generated in:

```text
frontend/dist/
```

To preview the production build locally:

```powershell
npm run preview
```

`dist/` is generated output and should normally remain outside Git.

---

# Running With Docker Compose

The project provides Docker Compose configurations for development and production.

## Development

From the repository root:

```powershell
docker compose up --build
```

Run in detached mode:

```powershell
docker compose up --build -d
```

View running containers:

```powershell
docker compose ps
```

View logs:

```powershell
docker compose logs -f
```

Stop the application:

```powershell
docker compose down
```

---

# Database Migrations With Docker

Run migrations inside the Django container:

```powershell
docker compose exec web python manage.py migrate
```

Create a superuser:

```powershell
docker compose exec web python manage.py createsuperuser
```

---

# Celery

The project uses Redis as the Celery broker and result backend.

The development/production Compose configuration includes:

```text
Django Web
     │
     ▼
   Redis
     │
     ▼
Celery Worker
```

Celery Beat is used for scheduled background tasks.

Check the running services:

```powershell
docker compose ps
```

---

# API

The Django backend exposes REST API endpoints for authentication and todo management.

The frontend communicates with the backend through Axios.

Typical API structure:

```text
/api/auth/
/api/todos/
```

Authentication uses JWT access and refresh tokens.

---

# API Documentation

The project uses OpenAPI documentation through Django REST Framework documentation tooling.

When running the development server, API documentation is available through the configured documentation endpoint.

Check the current Django configuration for the exact documentation route.

---

# Django Admin

The Django admin interface is available at:

```text
/admin/
```

For local development:

```text
http://127.0.0.1:8000/admin/
```

Create an administrator with:

```powershell
python manage.py createsuperuser
```

---

# Production Deployment

The project includes a dedicated production configuration:

```text
docker-compose.prod.yml
```

The production architecture uses:

```text
Internet
   │
   ▼
 Nginx
   │
   ▼
Gunicorn
   │
   ▼
Django
   │
   ├── PostgreSQL
   │
   └── Redis
          │
          ├── Celery Worker
          └── Celery Beat
```

Production Django configuration includes security settings such as:

* `DEBUG=False`
* Configurable `ALLOWED_HOSTS`
* Secure cookies
* HTTPS-related settings
* HSTS
* Frame protection
* Production logging
* SMTP configuration through environment variables

Production secrets should always be supplied through environment variables or a secure secret-management system.

---

# Building the Frontend for Deployment

From:

```text
todo-platform/frontend
```

run:

```powershell
npm ci
npm run build
```

This generates:

```text
frontend/dist/
```

The generated frontend assets can then be served through the configured production infrastructure.

---

# Docker Services

The production Compose configuration contains the following major services:

| Service  | Purpose                                     |
| -------- | ------------------------------------------- |
| `web`    | Django application running through Gunicorn |
| `worker` | Celery background worker                    |
| `beat`   | Celery periodic task scheduler              |
| `db`     | PostgreSQL database                         |
| `redis`  | Redis broker/backend                        |
| `nginx`  | Reverse proxy and HTTPS termination         |

---

# Security

Before publishing the repository:

### Never commit

```text
.env
.env.production
*.pem
*.key
private certificates
database passwords
API keys
secret keys
node_modules/
```

### Use

```text
.env.example
```

for documenting required environment variables without exposing real values.

---

# Git Ignore

The repository should ignore generated and sensitive files such as:

```gitignore
.venv/
__pycache__/
*.pyc

.env
.env.*

frontend/node_modules/
frontend/dist/

.vscode/
.idea/
```

`frontend/package-lock.json` should remain committed.

---

# Development Workflow

A typical development workflow is:

```text
1. Clone repository
       ↓
2. Configure .env
       ↓
3. Start PostgreSQL + Redis
       ↓
4. Run Django backend
       ↓
5. Install frontend dependencies
       ↓
6. Run React/Vite frontend
       ↓
7. Develop and test
       ↓
8. Build frontend
       ↓
9. Run Docker Compose
       ↓
10. Deploy
```

---

# Useful Commands

## Django

```powershell
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py shell
```

## Frontend

```powershell
cd frontend

npm install
npm run dev
npm run build
npm run preview
```

## Docker

```powershell
docker compose up --build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

---

# Project Status

This project is being developed as a production-oriented full-stack application and is intended to demonstrate practical experience with:

* Full-stack development
* REST API development
* Authentication and authorization
* React application architecture
* PostgreSQL
* Redis
* Asynchronous processing
* Docker
* Nginx
* Production configuration
* Deployment practices

---

# License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license text.

---

# Author

**<YOUR NAME>**

`GitHub:` https://www.github.com/vedantkalyankar

LinkedIn: https://linkedin.com/in/vedant-sudo
