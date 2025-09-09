from rest_framework import serializers
from .models import Application
from users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email"]

class ApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)   # include user details
    job = serializers.StringRelatedField(read_only=True)


    class Meta:
        model = Application
        fields = ["id", "user", "job", "status", "match_score", "resume", "created_at"]
        read_only_fields = ["user", "job", "match_score", "resume", "created_at"]  # only status is writable
    
    def get_resume(self, obj):
        from resumes.models import Resume
        resume = Resume.objects.filter(user=obj.user).first()
        if resume and resume.file:
            return {
                "url": resume.file.url,
                "name": resume.file.name.split("/")[-1],
            }
        return None
