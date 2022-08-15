from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _


@admin.register(get_user_model())
class UserAdmin(BaseUserAdmin):
    """ user admin config
    """
    readonly_fields = ('date_joined',)
    ordering = ('email',)
    search_fields = ("first_name", "last_name", "email")

    filter_horizontal = ('groups', 'user_permissions')
    list_display = ('email', 'first_name', 'last_name', 'date_joined')


    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'photo')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser',
                       'groups', 'user_permissions')
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined')
        })
    )
