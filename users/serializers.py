from django.conf import settings
from django.conf.global_settings import LANGUAGES

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.utils.translation import gettext as _

from rest_framework.serializers import Serializer, ModelSerializer
from rest_framework import serializers, exceptions
from .models import ForgotPasswordToken
from utils.query import get_object_or_none


class LoginSerializer(Serializer):
    """ user authentication
    """
    user = None
    _error = _("Incorrect Credentials. Please try again")

    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=settings.PASSWORD_MIN_LENGTH)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(LoginSerializer, self).__init__(*args, **kwargs)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError(self._error, code="authorization")

        user = get_object_or_none(
            get_user_model(), email__iexact=email)
        if not user:
            raise serializers.ValidationError(self._error, code="authorization")

        self.user = authenticate(request=self.request,
            email=user.email, password=password)

        if not self.user:
            raise serializers.ValidationError(self._error, code="authorization")

        return data


class SignupSerializer(ModelSerializer):
    """ signup serializer
    """
    password = serializers.CharField(write_only=True,min_length=settings.PASSWORD_MIN_LENGTH)

    class Meta:
        model = get_user_model()
        fields = (
            'first_name',
            'last_name',
            'email',
            'password',
        )


    @transaction.atomic
    def create(self, data):
        instance = super(SignupSerializer, self).create(data)
        instance.set_password(data.get('password'))
        instance.is_active = True
        instance.save()
        return instance


class UserSerializer(ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'photo',
        )



class ForgotPasswordSerializer(Serializer):
    """ password reset token
    """
    email = serializers.EmailField()

    user = None

    def validate_email(self, email):
        """ check if email belongs to a
            registered and active user.
        """
        users = get_user_model().objects \
            .filter(email=email, is_active=True)
        if not users.exists():
            raise serializers.ValidationError(
                "Email is not registered",
                code="invalid")

        self.user, = users

        return email

    def create(self):
        """ create password token
        """
        instance,is_created = ForgotPasswordToken.objects.get_or_create(user=self.user)
        instance.send()

        return instance


class ResetPasswordSerializer(Serializer):
    code = serializers.UUIDField(required=True,write_only=True)
    new_password = serializers.CharField(required=True,write_only=True,min_length=settings.PASSWORD_MIN_LENGTH)

    def validate_code(self,data):
        token = get_object_or_none(ForgotPasswordToken,code=data)
        if not token:
            raise serializers.ValidationError(_("Invalid or expired code"),code="invalid")
            
        self.token = token

        return data

    def update_password(self):
        password = self.validated_data.get('new_password')

        self.token.user.set_password(password)
        with transaction.atomic():
            self.token.user.save()
            self.token.delete()

        return self.token.user


