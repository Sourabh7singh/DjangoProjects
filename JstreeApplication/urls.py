from django.urls import path
from .views import *

urlpatterns = [
    path('file-tree/', get_file_tree, name='file_tree'),
    path('tree/', file_tree_view, name='file_tree_view'),
]
