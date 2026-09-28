from django.contrib import admin

from core.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "telephone")
    list_filter = ("role",)
    search_fields = ("user__username", "user__email")
