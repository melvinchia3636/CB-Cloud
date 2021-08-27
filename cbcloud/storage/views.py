from django.contrib.staticfiles.storage import staticfiles_storage
from django.shortcuts import render
from django.http import Http404
from django.conf import settings
import psutil
import os
import time
import json

def requestFiles(path):
	abs_path = os.path.join(settings.STORAGE_DIR, path)
	filetypes = json.load(open(staticfiles_storage.path("storage/filetype.json")))
	if not os.path.exists(abs_path): raise Http404
	files = []
	for i in filter(lambda i: not i.startswith('.'), sorted(os.listdir(abs_path), key=lambda i: i.lower())):
		type = "folder" if os.path.isdir(os.path.join(abs_path, i)) else "file"
		files.append({
		"type": type,
		"path": os.path.join(path, i).replace('\\', '/'),
		"icon": filetypes[i.split('.')[-1].lower()] if type == "file" and i.split('.')[-1].lower() in filetypes else "",
		"name": i,
		"last_mod": time.strftime("%d %b %Y", time.localtime(os.path.getmtime(os.path.join(abs_path, i)))),
		"created":  time.strftime("%d %b %Y", time.localtime(os.stat(os.path.join(abs_path, i)).st_ctime)),
		"size": os.path.getsize(os.path.join(abs_path, i))
	})

	return sorted(files, key=lambda i: ['folder', 'file'].index(i["type"]))

def HomeView(request):
	hdd = psutil.disk_usage(settings.STORAGE_DIR)
	files = requestFiles(settings.STORAGE_DIR)
	return render(request, 'storage/index.html', {
		'curtab': 1,
		'files': files,
		'used': round(hdd.used/1073741824), 
		'total': round(hdd.total/1073741824),
	})

def FileView(request, path):
	hdd = psutil.disk_usage(settings.STORAGE_DIR)
	files = requestFiles(path)
	return render(request, 'storage/index.html', {
		"curtab": 1,
		"files": files,
		'used': round(hdd.used/1073741824), 
		'total': round(hdd.total/1073741824),
	})