from django.urls import path
from .views import JobPostView

urlpatterns = [
    path('post/', JobPostView.as_view(), name='job-post')
    path('<int:job_id>/matches/', MatchedResumesView.as_view(), name='job-matches'),
]
