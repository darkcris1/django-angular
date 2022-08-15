from .serializers import ForgotPasswordSerializer, LoginSerializer, ResetPasswordSerializer, SignupSerializer, UserSerializer
from utils.query import SerializerProperty
from rest_framework import exceptions, filters
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, GenericViewSet, ModelViewSet
from django.shortcuts import get_object_or_404

# Create your views here.

class User(SerializerProperty, GenericViewSet):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get(self,request,**kwargs):
         instructor = get_object_or_404(self._model.Meta.model,**kwargs)
         return Response(self.get_serializer(instructor.user).data)


class Login(APIView):
    """ user authentication endpoint
    """
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, request=request)
        serializer.is_valid(raise_exception=True)

        for course in serializer.validated_data.get('courses',[]):
            serializer.user.cart.add_to_cart(course)

        return Response({
            'token': serializer.user.get_token().key
        }, status=200)


class Signup(APIView):
    """ user signup endpoint
    """
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'token': serializer.instance.get_token().key
        }, status=201)


class Auth(ViewSet, GenericViewSet):
    """ authenticated user's endpoint
    """
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)


class ForgotPasswordView(GenericViewSet):
    authentication_classes = []
    permission_classes = []
    serializer_class = ForgotPasswordSerializer

    def verify_email(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create()

        return Response(status=200)


    def reset_password(self,request):
        serializer = ResetPasswordSerializer(data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.update_password()
        return Response(status=200)
