from django.db import models

# Create your models here.

class FileModel(models.Model):
    file_name = models.CharField(max_length=100)
    content = models.CharField(max_length=10000,blank=True,null=True)
    language = models.CharField(max_length=100,blank=True,null=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.file_name