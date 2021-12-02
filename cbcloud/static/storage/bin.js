const ps = new PerfectScrollbar('.tab');
let selectedItem = null;

const goto = (path, id, type) => {
	if (selectedItem) $(`.table div:nth-child(${selectedItem}) > div > div`).removeClass('bg-indigo-200')
	selectedItem = id
	$(`.table div:nth-child(${selectedItem}) > div > div`).addClass('bg-indigo-200')
	$("#func-tools, #func-tools + div").removeClass('hidden').addClass('flex')
}

const removeFile = () => {
	$.ajax({
		url: "/api/permanent-remove",
		method: "POST",
		headers: {
			"X-CSRFToken": csrfToken
		},
		data: {
			name: $(`.table > div:nth-child(${selectedItem}) span`).text()
		},
		success: () => {
			location.reload()
		}
	})
}


IMAGEFIT_CACHE_ENABLED = True
IMAGEFIT_CACHE_BACKEND_NAME = 'imagefit'
CACHES = {
    'imagefit': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': os.path.join(tempfile.gettempdir(), 'django_imagefit')
    }
}