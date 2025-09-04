from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    recruiter_username = serializers.CharField(source="recruiter.username", read_only=True)

    class Meta:
        model = Job
        fields = [
            "id", "title", "description", "company",
            "location", "skills_required", "created_at",
            "recruiter", "recruiter_username",
        ]
        read_only_fields = ["recruiter", "created_at"]
