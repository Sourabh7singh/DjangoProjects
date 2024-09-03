from django.contrib.auth.models import User
from django.db import models


class EmployeeDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.IntegerField()
    
    def __str__(self):
        return self.name