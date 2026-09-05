from .base import *


DEBUG = False


ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
)

MAILERS = {
    "default": {
        "BACKEND": env(
            "EMAIL_BACKEND",
            default="django.core.mail.backends.smtp.EmailBackend",
        ),
        "HOST": env(
            "EMAIL_HOST",
            default="localhost",
        ),
        "PORT": env.int(
            "EMAIL_PORT",
            default=25,
        ),
        "USERNAME": env(
            "EMAIL_HOST_USER",
            default="",
        ),
        "PASSWORD": env(
            "EMAIL_HOST_PASSWORD",
            default="",
        ),
        "USE_TLS": env.bool(
            "EMAIL_USE_TLS",
            default=False,
        ),
        "USE_SSL": env.bool(
            "EMAIL_USE_SSL",
            default=False,
        ),
    },
}
SECURE_SSL_REDIRECT = True

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)


SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31536000

SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_HSTS_PRELOAD = True

SECURE_CONTENT_TYPE_NOSNIFF = True

X_FRAME_OPTIONS = "DENY"

SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"