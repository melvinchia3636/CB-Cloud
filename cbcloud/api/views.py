import os
import shutil
from django.conf import settings
from django.http import HttpResponse

def CreateFolder(request):
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

def MoveFile(request):
	data = request.POST
	source = data.get('source')
	target = data.get('target')
	source_path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:], source)
	target_path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:], target)
	if not os.path.exists(source_path) or not os.path.exists(target_path):
		#error message here
		...
	shutil.move(source_path, target_path)
	
	return HttpResponse("okay")