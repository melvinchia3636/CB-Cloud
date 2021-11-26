import os
import shutil
import json
from django.conf import settings
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from send2trash import send2trash
from django.contrib import messages

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
	
	messages.info(request, f'Folder "{name.strip()}" has been created')
	return HttpResponse("okay")

def MoveFile(request):
	data = request.POST
	source = data.get('source')
	target = data.get('target')
	source_path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:], source)
	target_path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:], target)
	if not os.path.exists(source_path) or not os.path.exists(target_path):
		#error message here
		return HttpResponse("okay")

	shutil.move(source_path, target_path)

	source_path = "/".join(source_path.replace('\\', '/').split('/')[:-1])

	if os.path.exists(source_path) and os.path.isfile(os.path.join(source_path, '.cbtag')):
		data = json.load(open(os.path.join(source_path, '.cbtag'), "r"))

		if source in data:
			tag, color = data[source]
			del data[source]
			json.dump(data, open(os.path.join(source_path, '.cbtag'), "w"))

			if os.path.exists(target_path) and os.path.isfile(os.path.join(target_path, '.cbtag')): ...
			else: open(os.path.join(target_path, '.cbtag'), "w").write('{}')

			data = json.load(open(os.path.join(target_path, '.cbtag'), "r"))
			data[source] = [tag, color]
			json.dump(data, open(os.path.join(target_path, '.cbtag'), "w"))
	
	return HttpResponse("okay")

def UploadFiles(request):
	files = request.FILES.getlist('files[]')
	data = request.POST
	path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:])
	fs = FileSystemStorage(path)

	if not os.path.exists(path):
		#error message here
		...
	for file in files:
		fs.save(file.name, file)

	messages.info(request, f'{len(files)} files has been uploaded')
	
	return HttpResponse("okay")

def RemoveFiles(request):
	data = request.POST
	name = data.get('name')
	path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:], name)
	shutil.move(path, os.path.join(settings.STORAGE_DIR, ".bin"))

	path = "/".join(path.replace('\\', '/').split('/')[:-1])
	if os.path.exists(path) and os.path.isfile(os.path.join(path, '.cbtag')):
		data = json.load(open(os.path.join(path, '.cbtag'), "r"))

		if name in data:
			del data[name]
			json.dump(data, open(os.path.join(path, '.cbtag'), "w"))

	messages.info(request, f'"{name}" has been moved to bin')

	return HttpResponse('okay')

def PermanentRemove(request):
	data = request.POST
	name = data.get('name')
	path = os.path.join(settings.STORAGE_DIR, '.bin', name)

	try:
		if os.path.exists(path): 
			messages.info(request, f'"{name}" has been permanently deleted')
			if os.path.isdir(path): shutil.rmtree(path)
			else: os.remove(path.replace('\\', '/'))
		else: messages.info(request, f'Failed to delete "{name}"')
	except:
		messages.info(request, f'Failed to delete "{name}"')

	return HttpResponse('okay')

def TagAdd(request):
	data = request.POST
	tag = data.get("tag")
	name = data.get('name')
	color = data.get('color')
	path = os.path.join(settings.STORAGE_DIR, *data.getlist('path[]')[1:])
	
	if os.path.exists(path) and os.path.isfile(os.path.join(path, '.cbtag')): ...
	else: open(os.path.join(path, '.cbtag'), "w").write('{}')

	data = json.load(open(os.path.join(path, '.cbtag'), "r"))
	data[name] = [tag, color]
	json.dump(data, open(os.path.join(path, '.cbtag'), "w"))

	return HttpResponse('okay')

def CreateCollection(request):
	data = request.POST
	name = data.get('name')

	DB_BASEDIR = os.path.join(settings.STORAGE_DIR, ".cbdb")
	
	if not os.path.isdir(DB_BASEDIR):
		os.mkdir(DB_BASEDIR)

	if os.path.isdir(os.path.join(DB_BASEDIR, name)):
		return HttpResponse('existed', status=409)

	try: os.mkdir(os.path.join(DB_BASEDIR, name))
	except Exception as e: return HttpResponse(e, status=400)

	return HttpResponse('okay')

def FetchCollection(request):
	DB_BASEDIR = os.path.join(settings.STORAGE_DIR, ".cbdb")

	if not os.path.isdir(DB_BASEDIR):
		return HttpResponse(json.dumps([]), content_type="application/json")
	else:
		return HttpResponse(json.dumps(sorted(os.listdir(DB_BASEDIR), key=lambda i: "0123456789abcdefghijklmnopqrstuvwxyz".index(i[0].lower()))), content_type="application/json")

def CreateDocument(request):
	data = request.POST
	collection = data.get('collection')
	document = data.get('document')
	data = data.get("data")
	DB_BASEDIR = os.path.join(settings.STORAGE_DIR, ".cbdb")

	if not os.path.isdir(os.path.join(DB_BASEDIR, collection)):
		return HttpResponse(status=403)

	if os.path.isdir(os.path.join(DB_BASEDIR, collection, document)):
		return HttpResponse('existed', status=409)

	try: open(os.path.join(DB_BASEDIR, collection, document), 'w').write(data)
	except Exception as e: return HttpResponse(e, status=400)

	return HttpResponse('okay')

def FetchDocument(request):
	data = request.GET
	collection = data.get('collection')
	DB_BASEDIR = os.path.join(settings.STORAGE_DIR, ".cbdb")

	if not collection or not os.path.isdir(os.path.join(DB_BASEDIR, collection)):
		return HttpResponse(json.dumps([]), content_type="application/json")
	else:
		return HttpResponse(json.dumps(sorted(os.listdir(os.path.join(DB_BASEDIR, collection)), key=lambda i: "0123456789abcdefghijklmnopqrstuvwxyz".index(i[0].lower()))), content_type="application/json")

def fetchDocContent(request):
	data = request.GET
	collection = data.get('collection')
	document = data.get('document')
	DB_BASEDIR = os.path.join(settings.STORAGE_DIR, ".cbdb")

	if collection and document and os.path.isfile(os.path.join(DB_BASEDIR, collection, document)):
		try: return HttpResponse(open(os.path.join(DB_BASEDIR, collection, document), 'r').read(), content_type="application/json")
		except Exception as e: return HttpResponse(json.dumps({}), content_type="application/json")
	else:
		return HttpResponse(json.dumps({}), content_type="application/json")
