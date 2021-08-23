from django.shortcuts import render
import psutil
import os
import time

def HomeView(request):
	hdd = psutil.disk_usage('G:/')
	files = sorted([{
		"type": "folder" if os.path.isdir(os.path.join("G:", i)) else "file",
		"name": i,
		"last_mod": time.strftime("%d %b %Y", time.localtime(os.path.getmtime(os.path.join('G:', i)))),
		"created":  time.strftime("%d %b %Y", time.localtime(os.stat(os.path.join('G:', i)).st_ctime)),
		"size": os.path.getsize(os.path.join('G:', i))
	} for i in filter(lambda i: not i.startswith('.'), sorted(os.listdir('G:/')))], key=lambda i: ['folder', 'file'].index(i["type"]))
	return render(request, 'storage/index.html', {
		'curtab': 1,
		'files': files,
		'used': round(hdd.used/1073741824), 
		'total': round(hdd.total/1073741824),
	})