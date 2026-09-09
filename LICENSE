# Todo Platform

A production-oriented **Todo Management Platform** built with Django REST Framework, PostgreSQL, Redis, Celery, Docker, and Nginx.

The project demonstrates how to design, develop, containerize, and run a modern backend application using a production-style architecture with asynchronous task processing, JWT authentication, PostgreSQL persistence, Redis, reverse proxying, and HTTPS.

---

## Features

* User registration and authentication
* JWT-based authentication
* Access and refresh tokens
* Token rotation and blacklisting
* Todo CRUD operations
* User-specific todo management
* PostgreSQL database
* Redis caching/message broker
* Celery asynchronous task processing
* Celery Beat scheduled tasks
* Django REST Framework
* API filtering, searching, ordering, and pagination
* API throttling
* Centralized exception handling
* Swagger/OpenAPI documentation
* Docker and Docker Compose
* Separate development and production configurations
* Gunicorn application server
* Nginx reverse proxy
* HTTPS/TLS support
* Environment-based configuration
* Structured application logging
* Custom Django user model
* Production-oriented security settings

---

# Architecture

```text
                         Client
                           |
                           v
                    +-------------+
                    |    Nginx    |
                    | Reverse     |
                    |   Proxy     |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Gunicorn  |
                    |    Django   |
                    | REST API    |
                    +------+------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
      +-------------+              +-------------+
      | PostgreSQL  |              |    Redis    |
      |  Database   |              | Broker/Cache|
      +-------------+              +------+------+
                                           |
                                           v
                                  +----------------+
                                  |     Celery     |
                                  |     Worker     |
                                  +----------------+
                                           |
                                           ^
                                  +----------------+
                                  |   Celery Beat  |
                                  |   Scheduler    |
                                  +----------------+
```

---

# Technology Stack

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* django-filter
* drf-spectacular
* Celery
* django-celery-beat

## Database

* PostgreSQL

## Message Broker / Cache

* Redis

## Web Server

* Gunicorn
* Nginx

## Containerization

* Docker
* Docker Compose

## Development Tools

* Git
* GitHub
* VS Code / PyCharm / IntelliJ-based IDEs
* PowerShell / Linux shell

---

# Project Structure

```text
todo-platform/
│
├── accounts/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── todos/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tasks.py
│   ├── urls.py
│   └── views.py
│
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   │
│   ├── celery.py
│   ├── exceptions.py
│   ├── urls.py
│   ├── wsgi.py
│   └── __init__.py
│
├── docker/
│   └── entrypoint.sh
│
├── nginx/
│   ├── nginx.conf
│   └── certs/
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── manage.py
├── requirements.txt
├── README.md
└── LICENSE
```

---

# Requirements

You can run the project using Docker, so you do not need to install PostgreSQL, Redis, or Celery directly on your host machine.

## Required

* Git
* Docker
* Docker Compose

Docker Desktop is the easiest option on Windows.

On Linux, Docker Engine and the Docker Compose plugin are sufficient.

Verify your installation:

```bash
docker --version
docker compose version
git --version
```

---

# Clone the Repository

Clone the public repository:

```bash
git clone https://github.com/<your-username>/todo-platform.git
```

Enter the project directory:

```bash
cd todo-platform
```

Replace `<your-username>` with your GitHub username.

---

# Environment Configuration

Never commit real environment variables, passwords, database credentials, JWT secrets, API keys, or private certificates to GitHub.

The repository should contain an example environment file:

```text
.env.example
```

Create your local environment file from it.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux/macOS

```bash
cp .env.example .env
```

Edit `.env` and provide your local configuration.

Example:

```env
SECRET_KEY=change-this-secret-key
DEBUG=True

DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1
```

Do not use example credentials or secrets for an actual production deployment.

---

# Running the Application with Docker

The project includes a development Docker Compose configuration.

Start all services:

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

# Development Architecture

The development environment contains:

```text
web
├── Django
└── Gunicorn

worker
└── Celery Worker

beat
└── Celery Beat

db
└── PostgreSQL

redis
└── Redis
```

The development configuration exposes the application on:

```text
http://localhost:8000
```

PostgreSQL is available to the host through the configured development port.

Redis is also exposed for development purposes.

---

# Database Migrations

Run migrations:

```bash
docker compose run --rm web python manage.py migrate
```

Create migrations after modifying models:

```bash
docker compose run --rm web python manage.py makemigrations
```

Apply migrations:

```bash
docker compose run --rm web python manage.py migrate
```

Check migration status:

```bash
docker compose run --rm web python manage.py showmigrations
```

---

# Create a Superuser

Create a Django admin user:

```bash
docker compose run --rm web python manage.py createsuperuser
```

Follow the prompts.

Django Admin will then be available at:

```text
http://localhost:8000/admin/
```

---

# API Documentation

The project uses **drf-spectacular** for OpenAPI schema generation.

The API documentation endpoints configured by the project can be accessed through the application's documentation routes.

Typical endpoints include:

```text
/api/schema/
/api/docs/
/api/redoc/
```

The exact URL configuration is defined in:

```text
config/urls.py
```

---

# Authentication

The API uses **JWT authentication**.

The authentication flow is:

```text
User
 |
 | Register/Login
 v
Authentication API
 |
 v
Access Token + Refresh Token
 |
 v
Authenticated API Requests
 |
 v
Todo APIs
```

Access tokens are short-lived, while refresh tokens provide a mechanism for obtaining new access tokens.

Refresh token rotation and blacklisting are enabled.

Clients should send the access token using:

```http
Authorization: Bearer <access-token>
```

---

# Todo API

Authenticated users can manage their own todos.

Typical operations include:

```text
POST   /api/todos/
GET    /api/todos/
GET    /api/todos/<id>/
PUT    /api/todos/<id>/
PATCH  /api/todos/<id>/
DELETE /api/todos/<id>/
```

The exact routes are defined in:

```text
todos/urls.py
```

---

# Filtering, Searching and Ordering

The API is configured with Django REST Framework filtering backends.

Supported capabilities include:

* Filtering
* Searching
* Ordering
* Pagination

The available fields depend on the Todo API implementation.

---

# Pagination

The API uses page-number pagination.

The configured default page size is:

```text
20
```

A typical paginated response follows the structure:

```json
{
    "count": 100,
    "next": "...",
    "previous": null,
    "results": []
}
```

---

# API Throttling

The application includes DRF request throttling.

Current configuration:

```text
Anonymous users:
20 requests/minute

Authenticated users:
120 requests/minute
```

This provides a basic layer of protection against excessive API requests.

---

# Celery

Celery is used for asynchronous background processing.

The project contains:

```text
Celery Worker
Celery Beat
Redis Broker
```

Start the complete environment:

```bash
docker compose up -d
```

Check Celery worker logs:

```bash
docker compose logs -f worker
```

Check Celery Beat logs:

```bash
docker compose logs -f beat
```

---

# Celery Beat

Celery Beat provides scheduled task execution.

The project uses:

```text
django-celery-beat
```

This allows periodic tasks to be managed through Django's database-backed scheduler.

Periodic tasks can be managed through Django Admin when configured.

---

# Redis

Redis is used as the Celery message broker and result backend.

The configured services use Redis databases:

```text
redis://redis:6379/0
redis://redis:6379/1
```

Redis is managed automatically by Docker Compose.

Check Redis:

```bash
docker compose exec redis redis-cli ping
```

Expected response:

```text
PONG
```

---

# PostgreSQL

PostgreSQL is the primary application database.

The development environment uses the PostgreSQL Docker container rather than requiring PostgreSQL to be installed directly on the host.

Check the database container:

```bash
docker compose ps db
```

View database logs:

```bash
docker compose logs -f db
```

---

# Django Management Commands

Run Django commands inside the web container.

## Django shell

```bash
docker compose exec web python manage.py shell
```

## Check configuration

```bash
docker compose exec web python manage.py check
```

## Check deployment configuration

```bash
docker compose exec web python manage.py check --deploy
```

## Collect static files

```bash
docker compose exec web python manage.py collectstatic --noinput
```

---

# Running Tests

Run the project's test suite using Django's test runner:

```bash
docker compose run --rm web python manage.py test
```

If additional testing frameworks are configured, run them according to the project's test configuration.

Before creating a pull request, verify:

```bash
docker compose run --rm web python manage.py check
docker compose run --rm web python manage.py test
```

---

# Production Configuration

The project contains a separate production Compose configuration:

```text
docker-compose.prod.yml
```

Production services include:

```text
nginx
web
worker
beat
db
redis
```

The production architecture is:

```text
Internet
    |
    v
  Nginx
    |
    v
Gunicorn
    |
    v
Django
    |
    +----------> PostgreSQL
    |
    +----------> Redis
                    |
                    +--> Celery Worker
                    |
                    +--> Celery Beat
```

---

# Production Environment

Create a production environment file locally.

For example:

```text
.env.production
```

This file should contain production-specific values such as:

```env
SECRET_KEY=<strong-production-secret>

DEBUG=False

ALLOWED_HOSTS=<your-domain>

DB_NAME=<production-database>
DB_USER=<production-user>
DB_PASSWORD=<strong-database-password>
DB_HOST=db
DB_PORT=5432

CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=<smtp-server>
EMAIL_PORT=587
EMAIL_HOST_USER=<email-user>
EMAIL_HOST_PASSWORD=<email-password>
EMAIL_USE_TLS=True
```

**Never commit `.env.production` to GitHub.**

---

# Running Production Containers

Build the production images:

```bash
docker compose -f docker-compose.prod.yml build
```

Start the production environment:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Check services:

```bash
docker compose -f docker-compose.prod.yml ps
```

View logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

# Production Database Migration

Run migrations:

```bash
docker compose -f docker-compose.prod.yml run --rm web python manage.py migrate
```

Create a superuser:

```bash
docker compose -f docker-compose.prod.yml run --rm web python manage.py createsuperuser
```

Collect static files:

```bash
docker compose -f docker-compose.prod.yml run --rm web python manage.py collectstatic --noinput
```

---

# Gunicorn

The production application server is Gunicorn.

The production web container runs Django through:

```text
config.wsgi:application
```

with multiple workers.

This provides a more production-oriented application server than Django's development server.

---

# Nginx

Nginx acts as the reverse proxy in the production configuration.

Responsibilities include:

* HTTP request handling
* HTTPS termination
* Reverse proxying
* TLS certificate handling
* Request forwarding
* Client request size limits
* Connection timeouts

The Nginx configuration is located at:

```text
nginx/nginx.conf
```

---

# HTTPS

The production configuration expects TLS certificates under:

```text
nginx/certs/
```

The current local configuration uses:

```text
localhost.crt
localhost.key
```

For a real public deployment, use a valid certificate issued for your actual domain.

**Never commit private TLS keys to GitHub.**

Add certificate files to `.gitignore` when appropriate.

---

# Security

The production configuration enables several Django security mechanisms, including:

* `DEBUG=False`
* Secure session cookies
* Secure CSRF cookies
* HTTPS redirect
* HSTS
* `X-Frame-Options: DENY`
* Content-type sniffing protection
* Referrer policy
* Proxy-aware HTTPS configuration
* JWT authentication
* API throttling

Production secrets are supplied through environment variables rather than being hard-coded into the source code.

---

# Docker Commands

## Start

```bash
docker compose up -d
```

## Stop

```bash
docker compose down
```

## Rebuild

```bash
docker compose build --no-cache
```

## Restart

```bash
docker compose restart
```

## View containers

```bash
docker compose ps
```

## View logs

```bash
docker compose logs -f
```

## View one service

```bash
docker compose logs -f web
```

```bash
docker compose logs -f worker
```

```bash
docker compose logs -f beat
```

## Open a shell inside the web container

```bash
docker compose exec web sh
```

## Remove containers

```bash
docker compose down
```

To also remove Docker volumes:

```bash
docker compose down -v
```

**Warning:** Removing volumes can permanently delete local database data.

---

# Development vs Production

| Feature            | Development          | Production                |
| ------------------ | -------------------- | ------------------------- |
| Django DEBUG       | Enabled              | Disabled                  |
| Application server | Gunicorn             | Gunicorn                  |
| Database           | PostgreSQL container | PostgreSQL container      |
| Redis              | Redis container      | Redis container           |
| Celery             | Enabled              | Enabled                   |
| Celery Beat        | Enabled              | Enabled                   |
| Reverse Proxy      | Not required         | Nginx                     |
| HTTPS              | Not required         | Enabled                   |
| Environment        | `.env`               | `.env.production`         |
| Configuration      | `development.py`     | `production.py`           |
| Compose file       | `docker-compose.yml` | `docker-compose.prod.yml` |

---

# Environment Variables

Example environment files should contain placeholders rather than real credentials.

Recommended repository files:

```text
.env.example
```

Local-only files:

```text
.env
.env.production
```

These should not be committed.

A public repository should never contain:

```text
Passwords
API keys
JWT secrets
Database credentials
Private SSH keys
TLS private keys
Cloud credentials
SMTP passwords
```

---

# Git Workflow

Clone the repository:

```bash
git clone https://github.com/<your-username>/todo-platform.git
```

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

Check changes:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add <feature-name>"
```

Push:

```bash
git push origin feature/<feature-name>
```

---

# Recommended `.gitignore`

The public repository should ignore sensitive and generated files.

At minimum, make sure the following are ignored:

```gitignore
# Python
__pycache__/
*.py[cod]
*.pyo

# Virtual environment
.venv/
venv/
env/

# Environment files
.env
.env.*
!.env.example

# Django
*.sqlite3
media/
staticfiles/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Python tooling
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Docker
*.log

# Nginx / TLS
nginx/certs/*.key
nginx/certs/*.pem
```

Review your `.gitignore` before pushing the project publicly.

---

# Troubleshooting

## Check all containers

```bash
docker compose ps
```

## Check application logs

```bash
docker compose logs -f web
```

## Check PostgreSQL

```bash
docker compose logs -f db
```

## Check Redis

```bash
docker compose logs -f redis
```

## Check Celery Worker

```bash
docker compose logs -f worker
```

## Check Celery Beat

```bash
docker compose logs -f beat
```

## Run Django system checks

```bash
docker compose run --rm web python manage.py check
```

## Rebuild containers

```bash
docker compose build --no-cache
docker compose up -d
```

---

# Common Docker Reset

If the development environment becomes inconsistent, you can recreate the containers:

```bash
docker compose down
docker compose up --build -d
```

For a complete local reset including database volumes:

```bash
docker compose down -v
docker compose up --build -d
```

**Use `down -v` carefully because it deletes the Docker-managed database volume.**

---

# Application Startup Flow

When the application starts:

```text
Docker Compose
      |
      v
PostgreSQL starts
      |
      v
Redis starts
      |
      v
Database health check
      |
      v
Django container starts
      |
      v
Entrypoint waits for PostgreSQL
      |
      v
Gunicorn starts
      |
      +--------------------+
      |                    |
      v                    v
Celery Worker        Celery Beat
      |                    |
      +---------+----------+
                |
                v
              Redis
```

This allows the application services to operate as independent containers while communicating through the Docker Compose network.

---

# API Request Flow

A typical authenticated Todo request follows this flow:

```text
Client
  |
  | HTTP Request + JWT
  v
Nginx
  |
  v
Gunicorn
  |
  v
Django REST Framework
  |
  +--> JWT Authentication
  |
  +--> Permission Check
  |
  +--> Throttling
  |
  +--> Serializer
  |
  +--> Todo View
  |
  v
PostgreSQL
  |
  v
JSON Response
```

---

# Background Task Flow

Asynchronous work follows:

```text
Django Application
       |
       | enqueue task
       v
     Redis
       |
       v
 Celery Worker
       |
       v
Background Task
       |
       v
PostgreSQL / External Service
```

Scheduled work follows:

```text
Celery Beat
    |
    | scheduled task
    v
  Redis
    |
    v
Celery Worker
    |
    v
Task Execution
```

---

# Project Goals

This project is intended to demonstrate practical backend engineering concepts rather than only basic CRUD functionality.

Key engineering goals include:

* Clean project organization
* Separation of development and production settings
* RESTful API design
* Secure authentication
* Relational database design
* Asynchronous processing
* Scheduled background jobs
* Containerized services
* Reverse proxy architecture
* Environment-based configuration
* Production-oriented security
* Logging and observability foundations
* Reproducible development environments

---

# Future Improvements

Potential future improvements include:

* Automated CI/CD pipeline
* Automated test coverage reporting
* Redis caching for frequently accessed data
* Advanced monitoring
* Prometheus metrics
* Grafana dashboards
* Centralized log aggregation
* Rate limiting at the Nginx layer
* Cloud deployment
* Managed PostgreSQL
* Managed Redis
* Object storage for media
* Container image publishing
* Automated database backups
* Horizontal application scaling
* Kubernetes deployment
* Infrastructure as Code

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update tests where appropriate.
5. Run the project's checks.
6. Commit your changes.
7. Push your branch.
8. Open a Pull Request.

Example:

```bash
git checkout -b feature/add-task-filter
```

Then:

```bash
git add .
git commit -m "Add task filtering"
git push origin feature/add-task-filter
```

---

# License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license text.

---

# Author

**Your Name**

GitHub: `https://github.com/vedantkalyankar`

---

# Disclaimer

This project is provided for educational, portfolio, and development purposes.

Before deploying the application to a real production environment, review the complete infrastructure, security configuration, secrets management, database backup strategy, monitoring, TLS configuration, domain configuration, and operational requirements for your deployment environment.
