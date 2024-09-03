from django.urls import path
from .views import home,addDetails,ViewEmployees,EditEmployee
urlpatterns = [
    path('',home.as_view(),name='index'),
    path('add-details/<str:user>',addDetails.as_view(),name='add-details'),
    path('view-employees/',ViewEmployees.as_view(),name='view-employees'),
    path('edit-employee/<slug:user>',EditEmployee.as_view(),name='edit-employee'),
]