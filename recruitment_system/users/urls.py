from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
]
