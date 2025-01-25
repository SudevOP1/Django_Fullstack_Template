from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    body = models.TextField()

    def __str__(self):
        return self.user.username + ": " + self.body[:10]
