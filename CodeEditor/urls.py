from django.urls import path
from .views import *

urlpatterns = [
    path('', Index.as_view(), name='codeEditor_index'),
    path('create-file/', create_file, name='create_file'),
    path('preview-markdown/', preview_markdown, name='preview-markdown'),
    path('run_code/', run_code, name='run_code'),
    path('get-content/<str:file_id>/', GetFileContent.as_view(), name='get-content'),
    path('delete-file/<int:pk>/', FileDeleteView.as_view(), name='delete_file'),
    path('file-tree/', FileTreeView.as_view(), name='file-tree'),


    path('create-node/', CreateNodeView.as_view(), name='create-node'),
    path('rename-node/', rename_node, name='rename-node'),

    path('delete-node/', DeleteNodeView.as_view(), name='delete-node'),

]
