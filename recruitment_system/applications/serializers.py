from rest_framework import serializers
from .models import Application
from users.models import CustomUser
from jobs.models import Job
from resumes.models import Resume


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email"]


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "title", "company", "location"]


class ApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)  
    resume = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ["id", "user", "job", "status", "recruiter_message", "match_score", "resume", "created_at"]
        read_only_fields = ["user", "job", "match_score", "resume", "created_at"]  # only status is writable
    
    def get_user(self, obj):
        return {"id": obj.user.id, "username": obj.user.username}
    
    def get_resume(self, obj):
        resume = Resume.objects.filter(user=obj.user).first()
        if resume and resume.file:
            return {
                "url": resume.file.url,
                "name": resume.file.name.split("/")[-1],
            }
        return None
