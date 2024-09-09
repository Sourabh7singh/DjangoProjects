from django.db import models

class FileModel(models.Model):
    file_name = models.CharField(max_length=100)
    content = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    is_dir = models.BooleanField(default=False)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.file_name
