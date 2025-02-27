# filepath: /c:/Users/Juliana/medisync_backend/api/views.py
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class LoginView(APIView):
    def post(self, request):
        print("Request data:", request.data)  # Debugging
        username = request.data.get('username')  # Change to 'email' if needed
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        print("Authenticated user:", user)  # Debugging

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)