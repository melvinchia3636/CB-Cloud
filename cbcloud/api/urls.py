from django.urls import path
from . import views

urlpatterns = [
	path('create-folder', views.CreateFolder, name="api-create-folder")
]