from django.urls import path
from . import views

urlpatterns = [
	path('create-folder', views.CreateFolder, name="api-create-folder"),
	path('move-file', views.MoveFile, name="api-move-file")
]