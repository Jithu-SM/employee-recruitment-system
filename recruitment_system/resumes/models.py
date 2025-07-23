from django.db import models
from users.models import CustomUser

class Resume(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    parsed_data = models.JSONField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
