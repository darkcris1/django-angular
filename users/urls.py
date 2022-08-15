

from django.urls import path

from users.views import Auth, ForgotPasswordView, Login, Signup


urlpatterns = [
    path('login/', Login.as_view()),
    path('signup/', Signup.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view({
        'post': 'verify_email',
    })),
    path('reset-password/', ForgotPasswordView.as_view({
        'put': 'reset_password',
    })),
    path('auth/', Auth.as_view({
        'get': 'get'
    })),
]