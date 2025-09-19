from django.urls import path
from .views import (
    AdminUserListView, AdminUserDetailView,
    AdminJobListView, AdminJobDetailView,
    AdminResumeListView, AdminApplicationListView
)

urlpatterns = [
    path("users/", AdminUserListView.as_view(), name="admin-users"),
    path("users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("jobs/", AdminJobListView.as_view(), name="admin-jobs"),
    path("jobs/<int:pk>/", AdminJobDetailView.as_view(), name="admin-job-detail"),
    path("resumes/", AdminResumeListView.as_view(), name="admin-resumes"),
    path("applications/", AdminApplicationListView.as_view(), name="admin-applications"),
]
