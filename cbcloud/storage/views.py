from django.contrib.staticfiles.storage import staticfiles_storage
from django.http.response import HttpResponse
from django.shortcuts import render
from django.http import Http404
from django.conf import settings
import psutil
import os
import time
import json

def requestFiles(path):
	path = os.path.join(settings.STORAGE_DIR, path)
	filetypes = json.load(open(staticfiles_storage.path("storage/filetype.json")))
	if not os.path.exists(path): raise Http404
	files = []
	for i in filter(lambda i: not i.startswith('.'), sorted(os.listdir(path))):
		type = "folder" if os.path.isdir(os.path.join(path, i)) else "file"
		files.append({
		"type": type,
		"icon": filetypes[i.split('.')[-1].lower()] if type == "file" and i.split('.')[-1].lower() in filetypes else "",
		"name": i,
		"last_mod": time.strftime("%d %b %Y", time.localtime(os.path.getmtime(os.path.join(path, i)))),
		"created":  time.strftime("%d %b %Y", time.localtime(os.stat(os.path.join(path, i)).st_ctime)),
		"size": os.path.getsize(os.path.join(path, i))
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

def APIView(request): 
	data = request.POST
	name = data.get('name')
	path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:])
	if not os.path.exists(path):
		#error message here
		...

	folder_path = os.path.join(path, name)
	try: os.mkdir(folder_path)
	except: raise #also error code

	return HttpResponse("okay")