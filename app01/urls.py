from django.urls import path, re_path
from app01 import views

urlpatterns = [
    re_path(r'^map.html$', views.index, name='index'),
    path(r'updateData/', views.updateData, name='updateData'),

]