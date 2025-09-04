from django.urls import path
from .views import MatchedResumesView, JobListCreateView, JobPostView, JobSuggestionsView, RecruiterJobsView

urlpatterns = [
    path('post/', JobPostView.as_view(), name='job-post'),
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('<int:job_id>/matches/', MatchedResumesView.as_view(), name='job-matches'),
    path('suggestions/', JobSuggestionsView.as_view(), name='job-suggestions'),
    path('recruiter/', RecruiterJobsView.as_view(), name='recruiter-jobs'),
]