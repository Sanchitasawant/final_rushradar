from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        # One-time default admin bootstrap (post-migrate)
        from django.db.models.signals import post_migrate

        def _ensure_default_admin(sender, **kwargs):
            import os
            from django.contrib.auth import get_user_model

            username = os.environ.get("DEFAULT_ADMIN_USERNAME")
            password = os.environ.get("DEFAULT_ADMIN_PASSWORD")
            email = os.environ.get("DEFAULT_ADMIN_EMAIL", "")

            # Only run when explicitly configured
            if not username or not password:
                return

            User = get_user_model()

            # Prevent duplicates: if username exists, do nothing
            if User.objects.filter(username=username).exists():
                return

            # Create a staff+superuser account (password hashed by create_superuser)
            User.objects.create_superuser(username=username, email=email, password=password)

        post_migrate.connect(_ensure_default_admin, sender=self)
