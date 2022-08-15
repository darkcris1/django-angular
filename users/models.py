import datetime
import os
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.conf import settings
from django.utils import timezone
from rest_framework.authtoken.models import Token
from django.template.loader import render_to_string
from users.managers import UserManager
from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import post_save, pre_save
from utils.helpers import field_image_to_webp
from django.dispatch import receiver

# Create your models here.

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255)
    first_name = models.CharField(max_length=255,null=True,blank=True)
    last_name = models.CharField(max_length=255,null=True,blank=True)
    photo = models.ImageField(upload_to='user-photo',blank=True,null=True)
    email = models.EmailField(db_index=True, unique=True,  null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    date_joined = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.email}"

    def get_display_name(self):
        return f"{self.last_name.title()}, {self.first_name.title()}"

    def get_token(self):
        """ get or generate an auth token that is valid
            for `settings.AUTH_TOKEN_EXPIRY_TIME`
        """
        token, created = Token.objects.get_or_create(user=self)
        expiry_date = token.created + datetime.timedelta(
            days=settings.AUTH_TOKEN_EXPIRY_TIME)
        
        if not created and expiry_date < timezone.now():
            token.delete()
            token = Token.objects.create(user=self)
        
        return token


@receiver(post_save, sender=User)
def after_save_user(instance=None, created=False, **kwargs):
    field_image_to_webp(instance,'photo')

class ForgotPasswordToken(models.Model):
    """ password request token
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.UUIDField(default=uuid.uuid4,editable=False,null=True,blank=True)
    is_used = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    is_sent = models.BooleanField(default=False)


    @property
    def absolute_url(self):
        return os.path.join(settings.SITE_URL, f"login/reset/password/{self.code.hex}")
            
    def __str__(self):
        return f"[{self.user}] {self.code}"

    def send(self):
        """ send password reset code to
            the user's email.
        """
        html_content = render_to_string(
            'users/emails/password_reset.html',
            {'obj': self},
        )
        text_content = render_to_string(
            'users/emails/password_reset.txt',
            {'obj': self}
        )

        msg = EmailMultiAlternatives(
            "Reset your password",
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [self.user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        self.is_sent = True
        self.save()

        return