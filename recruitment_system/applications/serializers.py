from rest_framework import serializers
from .models import Application
from users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email"]

class ApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)   # include user details

    class Meta:
        model = Application
        fields = ["id", "user", "status", "match_score", "created_at"]
