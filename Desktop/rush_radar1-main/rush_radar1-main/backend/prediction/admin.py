from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import CrowdData, PredictionHistory, Visitor

# Removed from Admin UI per requirements
# @admin.register(CrowdData)
# class CrowdDataAdmin(admin.ModelAdmin):
#     list_display = ("train", "station", "time", "day", "weather", "crowd_badge")
#     list_filter = ("crowd_level", "weather", "day", "station")
#     search_fields = ("train__name", "station__name")
#     ordering = ("time",)
#
#     def crowd_badge(self, obj):
#         colors = {
#             "HIGH": "#dc2626",    # Red
#             "MEDIUM": "#d97706",  # Orange
#             "LOW": "#16a34a"      # Green
#         }
#         color = colors.get(obj.crowd_level, "grey")
#         return format_html(
#             '<span style="color: white; background-color: {}; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 11px; letter-spacing: 0.5px;">{}</span>',
#             color,
#             obj.crowd_level
#         )
#     crowd_badge.short_description = "Crowd Level"

@admin.register(PredictionHistory)
class PredictionHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user_link", "station", "train", "weather", "day", "crowd_badge", "created_at")
    list_filter = ("predicted_crowd", "weather", "day", "station")
    search_fields = ("station", "train", "user__username", "user__email")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = ("user", "station", "train", "weather", "day", "predicted_crowd", "created_at")

    def crowd_badge(self, obj):
        colors = {
            "HIGH": "#dc2626",
            "MEDIUM": "#d97706",
            "LOW": "#16a34a"
        }
        color = colors.get(obj.predicted_crowd, "grey")
        return format_html(
            '<span style="color: white; background-color: {}; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 11px; letter-spacing: 0.5px;">{}</span>',
            color,
            obj.predicted_crowd
        )
    crowd_badge.short_description = "Predicted Crowd"

    def user_link(self, obj):
        if obj.user:
            return format_html('<strong style="color: #2563eb;">{}</strong>', obj.user.username)
        return mark_safe('<span style="color: #9ca3af; font-style: italic;">Anonymous</span>')
    user_link.short_description = "User"

    # Show count summary
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        # We can pass total prediction stats to the admin template if we wanted to override it.
        # For now, Jazzmin will handle the styling beautifully.
        return super().changelist_view(request, extra_context=extra_context)

@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ("id", "user_link", "session_key", "path", "ip_address", "visited_at")
    list_filter = ("path", "visited_at")
    search_fields = ("session_key", "user__username", "ip_address")
    ordering = ("-visited_at",)
    date_hierarchy = "visited_at"
    readonly_fields = ("user", "session_key", "path", "ip_address", "user_agent", "visited_at")

    def user_link(self, obj):
        if obj.user:
            return format_html('<strong style="color: #2563eb;">{}</strong>', obj.user.username)
        return mark_safe('<span style="color: #9ca3af; font-style: italic;">Anonymous</span>')
    user_link.short_description = "User"