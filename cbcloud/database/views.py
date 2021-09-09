from django.shortcuts import render
import psutil
from django.conf import settings
import os

def HomeView(request):
	hdd = psutil.disk_usage(settings.STORAGE_DIR)
	
	return render(request, "database/index.html", {
		'curtab': 2,
		'used': round(hdd.used/1073741824), 
		'total': round(hdd.total/1073741824),
	})