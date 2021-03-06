from django.urls import path
from . import views

urlpatterns = [
	#file storage
	path('create-folder', views.CreateFolder, name="api-create-folder"),
	path('move-file', views.MoveFile, name="api-move-file"),
	path('upload-files', views.UploadFiles, name="api-upload-files"),
	path('remove-file', views.RemoveFiles, name="api-remove-files"),
	path('permanent-remove', views.PermanentRemove, name="api-permanent-remove"),
	path('add-tag', views.TagAdd, name="api-add-tag"),
]