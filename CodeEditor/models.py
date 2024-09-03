from django.db import models
from sympy import content

# Create your models here.
class BookModel(models.Model):
    file_name = models.CharField(max_length=100)
    content = models.CharField(max_length=10000)
    language = models.CharField(max_length=100)
    