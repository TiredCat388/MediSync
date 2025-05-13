from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class PhysicianLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_superuser:
                return Response({"error": "Superusers are not allowed to access this application."}, status=status.HTTP_403_FORBIDDEN)

            if user.role == 'physician':
                return Response({"message": "Login successful, welcome physician!"}, status=status.HTTP_200_OK)
            
            return Response({"error": "Unauthorized access, only physicians are allowed."}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class NurseLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_superuser:
                return Response({"error": "Superusers are not allowed to access this application."}, status=status.HTTP_403_FORBIDDEN)

            return Response({"message": "Nurse login successful"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
