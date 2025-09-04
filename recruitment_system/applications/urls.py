from django.urls import path
from .views import ApplicationCreateView, ApplicationListView, ApplyJobView, ApplicationDetailView, JobApplicationsView

urlpatterns = [
    path('apply/', ApplicationCreateView.as_view(), name='apply-job'),
    path('my-applications/', ApplicationListView.as_view(), name='my-applications'),
    path('<int:job_id>/apply/', ApplyJobView.as_view(), name='apply-job'),
    path("<int:pk>/", ApplicationDetailView.as_view(), name="application-detail"),
    path("job/<int:job_id>/", JobApplicationsView.as_view(), name="job-applications"),
]
