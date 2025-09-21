from rest_framework import serializers
from users.models import CustomUser
from jobs.models import Job
from resumes.models import Resume
from applications.models import Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = "__all__"

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
