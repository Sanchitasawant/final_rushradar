from .models import Visitor


class VisitorTrackingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.session.session_key:
            request.session.create()

        path = request.path or "/"
        skip_prefixes = ("/static/", "/media/")

        if not path.startswith(skip_prefixes):
            xff = request.META.get("HTTP_X_FORWARDED_FOR")
            ip_address = xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR")

            Visitor.objects.create(
                user=request.user if request.user.is_authenticated else None,
                session_key=request.session.session_key,
                path=path[:255],
                ip_address=ip_address,
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:512],
            )

        response = self.get_response(request)
        return response
