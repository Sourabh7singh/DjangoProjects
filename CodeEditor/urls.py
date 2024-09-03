from django.urls import path
from .views import *

urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('create-file/', create_file, name='create_file'),
    path('preview-markdown/', preview_markdown, name='preview-markdown'),
    path('run_code/', run_code, name='run_code'),
    path('get-content/<str:file_id>/', GetFileContent.as_view(), name='get-content'),
]