from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    error_code = "api_error"

    if response.status_code == 400:
        error_code = "validation_error"

    elif response.status_code == 401:
        error_code = "authentication_error"

    elif response.status_code == 403:
        error_code = "permission_denied"

    elif response.status_code == 404:
        error_code = "not_found"

    elif response.status_code == 429:
        error_code = "rate_limit_exceeded"

    elif response.status_code >= 500:
        error_code = "server_error"

    details = response.data

    if isinstance(details, dict) and "detail" in details:
        message = str(details["detail"])
        details = None
    else:
        message = "Request failed."

    response.data = {
        "error": {
            "code": error_code,
            "message": message,
            "details": details,
        }
    }

    return response