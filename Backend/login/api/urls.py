# login/api/urls.py
from django.urls import path
from .views import PhysicianLoginView, NurseLoginView

urlpatterns = [
    path('login/physician/', PhysicianLoginView.as_view(), name='physician-login'),
    path('login/nurse/', NurseLoginView.as_view(), name='nurse-login'),
]