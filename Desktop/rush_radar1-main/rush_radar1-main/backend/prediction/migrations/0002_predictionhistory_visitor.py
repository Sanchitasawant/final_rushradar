from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("prediction", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PredictionHistory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("station", models.CharField(max_length=100)),
                ("train", models.CharField(max_length=100)),
                ("weather", models.CharField(max_length=50)),
                ("day", models.CharField(max_length=20)),
                ("predicted_crowd", models.CharField(max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="prediction_history",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Visitor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("session_key", models.CharField(db_index=True, max_length=100)),
                ("path", models.CharField(max_length=255)),
                ("ip_address", models.GenericIPAddressField(blank=True, null=True)),
                ("user_agent", models.TextField(blank=True)),
                ("visited_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="visits",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-visited_at"]},
        ),
        migrations.AddIndex(
            model_name="predictionhistory",
            index=models.Index(fields=["station", "predicted_crowd"], name="prediction_s_5852f8_idx"),
        ),
        migrations.AddIndex(
            model_name="predictionhistory",
            index=models.Index(fields=["weather"], name="prediction_w_0f9d5b_idx"),
        ),
        migrations.AddIndex(
            model_name="predictionhistory",
            index=models.Index(fields=["day"], name="prediction_d_7bf4c6_idx"),
        ),
        migrations.AddIndex(
            model_name="visitor",
            index=models.Index(fields=["path", "visited_at"], name="prediction_p_3ff096_idx"),
        ),
    ]
