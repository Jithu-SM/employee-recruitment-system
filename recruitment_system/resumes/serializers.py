from rest_framework import serializers
from .models import Resume
from users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email"]

class ResumeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  

    class Meta:
        model = Resume
        fields = ["id", "user", "file", "uploaded_at"]
