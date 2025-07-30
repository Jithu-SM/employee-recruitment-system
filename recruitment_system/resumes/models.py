from django.db import models
from users.models import CustomUser

class Resume(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    parsed_data = models.JSONField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Resume"
