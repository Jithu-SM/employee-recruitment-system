from django.urls import path
from .views import ApplicationCreateView, ApplicationListView

urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='apply-job'),
    path('my-applications/', ApplicationListView.as_view(), name='my-applications'),
]
