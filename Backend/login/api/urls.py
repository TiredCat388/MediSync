from django.urls import path
from login.views import LoginView

urlpatterns = [
    path('token/', LoginView.as_view(), name='token'),
]