from django.urls import path
from .views import MatchedResumesView, JobListCreateView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    # path('post/', JobPostView.as_view(), name='job-post'),
    path('<int:job_id>/matches/', MatchedResumesView.as_view(), name='job-matches'),
]
