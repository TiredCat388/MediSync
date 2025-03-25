from rest_framework import routers
from django.urls import path, include
from .views import MedicationsViewSet

router = routers.DefaultRouter()
router.register(r'medications', MedicationsViewSet, basename='medications')
urlpatterns = [
    path('', include(router.urls)),
]

