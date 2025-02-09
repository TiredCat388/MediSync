from rest_framework import routers
from django.urls import path, include
from .views import LogsViewSet

router = routers.DefaultRouter()
router.register(r'logs', LogsViewSet)
urlpatterns = [
    path('', include(router.urls))
]