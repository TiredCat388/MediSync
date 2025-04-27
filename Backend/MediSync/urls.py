from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.http import HttpResponse
from rest_framework.authtoken.views import obtain_auth_token

def home(request):
    return HttpResponse("Welcome to the Medisync Backend")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('logs.api.urls')),
    path('api/', include('login.api.urls')),
    path('api/', include('patients.api.urls')),
    path('api/', include('medications.api.urls')),
     path('api/', include('settings.api.urls')), 
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]