from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
	path('', views.HomeView, name="storage"),
	url(r'api-fetch/(?P<path>.*)', views.APIFetchFileWithPathView, name="api-fetch-file-with-path"),
	url(r'^(?P<path>.*)$', views.FileView, name="fileview"),
]