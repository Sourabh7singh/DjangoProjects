from django.db import models

# Create your models here.
class slides(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=10000)

