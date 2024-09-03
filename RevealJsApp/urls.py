from django.urls import path
from .views import *
urlpatterns = [
    path('',Index.as_view(),name='index'),
    path('editable-markdown/',EditableMarkdown.as_view(),name='editable-markdown'),
    path('view-md/<str:title>/', ModeledData.as_view(), name='view-md'),
    path('create-file/', create_file, name='create_file'),
    path('get-content/<str:file_id>/', GetFileContent.as_view(), name='get-content'),
]
