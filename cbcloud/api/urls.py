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

	#database
	path('create-collection', views.CreateCollection, name="api-create-collection"),
	path('fetch-collections', views.FetchCollection, name="api-fetch-collections"),
	path('create-document', views.CreateDocument, name="api-create-document"),
]