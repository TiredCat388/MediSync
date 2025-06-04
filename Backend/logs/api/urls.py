from rest_framework import routers
from django.urls import path, include
from .views import LogsViewSet, server_time

router = routers.DefaultRouter()
router.register(r'logs', LogsViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('server-time/', server_time, name='server-time'),
]