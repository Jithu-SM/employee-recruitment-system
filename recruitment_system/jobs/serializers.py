from rest_framework import serializers
from .models import Job
from applications.models import Application


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
        
    def get_applied(self, obj):
        user = self.context["request"].user
        return Application.objects.filter(user=user, job=obj).exists()

