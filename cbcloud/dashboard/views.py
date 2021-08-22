from django.shortcuts import render
import os
import psutil

def HomeView(request):
	hdd = psutil.disk_usage('G:/')
	files = filter(lambda i: not i.startswith('.'), os.listdir('G:/'))
	return render(request, 'dashboard/index.html', {
		'files': files, 
		'used': round(hdd.used/1073741824), 
		'total': round(hdd.total/1073741824),
		'quick': [
			{
				"name": "Revenge Lyrics",
				"type": "pdf",
				"last": "2 months ago",
				"icon": {
					"name": "grommet-icons:document-pdf",
					"color": "#FF4D4D"
				},
				"bg": "#FFCECE"
			},
			{
				"name": "Word Docs",
				"type": "docx",
				"last": "yesterday",
				"icon": {
					"name": "file-icons:microsoft-word",
					"color": "#617AFE"
				},
				"bg": "#CCD4FF"
			},
			{
				"name": "Nice Slideshow",
				"type": "pptx",
				"last": "2 years ago",
				"icon": {
					"name": "file-icons:microsoft-powerpoint",
					"color": "#FFAF51"
				},
				"bg": "#FFE5C6"
			},
			{
				"name": "Marks Report",
				"type": "xlsx",
				"last": "3 weeks ago",
				"icon": {
					"name": "file-icons:microsoft-excel",
					"color": "#25BF87"
				},
				"bg": "#C6FCE9"
			},
			{
				"name": "IMG_9487",
				"type": "png",
				"last": "27 June 2020",
				"icon": {
					"name": "file-icons:image",
					"color": "#9948FF"
				},
				"bg": "#E0C8FF"
			},
		]
	})