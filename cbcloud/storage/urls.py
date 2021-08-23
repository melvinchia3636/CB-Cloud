from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
	path('', views.HomeView, name="storage"),
	url(r'^(?P<path>.*)$', views.FileView, name="fileview"),
]