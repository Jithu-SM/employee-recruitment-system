from django.db import models
from users.models import CustomUser

class Job(models.Model):
    recruiter = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    skills_required = models.TextField()
    experience_required = models.IntegerField()
    posted_at = models.DateTimeField(auto_now_add=True)
