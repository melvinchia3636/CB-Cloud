const ps = new PerfectScrollbar('.tab');
let selectedItem = null;
let dragTo;
let isDownloading;

const arrow = `<svg class="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
paths = window.location.pathname.split('/').filter(e => e);
paths = paths.map((e, i) => {
	return `<a href="/${paths.slice(0, i+1).join('/')}">${decodeURI(e)}</a>`;
})
const getPath = () => paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML);
$('#breadcrumb').append(paths.slice(0, paths.length-1).join(arrow));
$('#breadcrumb').append(`${paths.length > 1 ? arrow : ""}<span class='font-bold'>${paths[paths.length-1]}</span>`);

const button = document.getElementById('color-pick');
let picker = new ColorPicker(button, '#5E78FF');

const goto = (item, id) => {
	const {path, type} = item.dataset;
	if (selectedItem == id) {
		if (type === "folder") {
			window.location += (!(window.location.href[window.location.href.length-1] === "/") ? "/" : "") + path;
		} else {
			window.open(encodeURI(`${window.location.origin}/files/${path}`).replace('#', "%23"), "_blank");
		}
	} else {
		if (selectedItem) $(`.table div:nth-child(${selectedItem}) > div > div`).removeClass('bg-indigo-200');
		selectedItem = id;
		$(`.table div:nth-child(${selectedItem}) > div > div`).addClass('bg-indigo-200');
		$("#func-tools, #func-tools + div").removeClass('hidden').addClass('flex');
	}
}

const newFolderPromptShow = () => {
	$("#folder-create").removeClass("invisible").addClass('black-op-bg');
	$(".add > div").removeClass('show');
	setTimeout(function() { $('#folder-create input:first-child()').focus() }, 500);
}

const newFolderPromptHide = () => {
	$("#folder-create").addClass("invisible").removeClass('black-op-bg');
}

const addTagPromptHide = () => {
	$("#add-tag").addClass("invisible").removeClass('black-op-bg');
}

const addTagPromptShow = () => {
	$("#add-tag").removeClass("invisible").addClass('black-op-bg');
	setTimeout(function() { $('#add-tag input:first-child()').focus() }, 500);
}

$("#folder-create form").submit(e => {
	e.preventDefault()

	const folderName = $("#folder-create input").val() || "Untitled Folder";
	$.ajax({
		url: "/api/create-folder",
		method: "POST",
		headers: {
			'X-CSRFToken': csrfToken
		},
		data: {
			path: getPath(),
			name: folderName
		},
		success: () => {
			newFolderPromptHide()
			setTimeout(() => {location.reload();}, 500)
		}
	});
})

$(".add > button").click(() => {
	$(".add > div").addClass('show');
})

$('body').on('click', function (e) {
	if (!$(".add *").is(e.target) && $(".add > div").has(e.target).length === 0 && $(".add > div").is(":visible")) {
		$(".add > div").removeClass('show');
	}
});

const droppable = new Draggable.Droppable(document.querySelectorAll('.table'), {
	draggable: `.item`,
	dropzone: '.dropzone',
	mirror: {
		constrainDimensions: true,
	  },
	delay: 150,
});

droppable.on('drag:over', e => {
	dragTo = e.over;
});

droppable.on('droppable:stop', e => {
	const source = e.dropzone.children[0].querySelector('span').innerText;
	const target = dragTo.querySelector('span').innerText;
	if (dragTo.dataset.type === "folder" && !(source === target)) {
		$.ajax({
			url: "/api/move-file",
			method: "POST",
			headers: {
				'X-CSRFToken': csrfToken
			},
			data: {
				source,
				target,
				path: getPath()
			},
			success: () => {
				location.reload()
			}
		});
	}
});

const uploadFile = () => {
	$(".add > div").removeClass('show');
	$('#upload').trigger('click');
}

$('#upload').on("change", function () {
	const formdata = new FormData();
	for (file of this.files) {
		formdata.append("files[]", file);
	}
	getPath().forEach(e => {
		formdata.append('path[]', e);
	});

	$.ajax({
		url: "/api/upload-files",
		method: "POST",
		data: formdata,
		processData: false,
		contentType: false,
		headers: {
			'X-CSRFToken': csrfToken
		},
		data: formdata,
		success: () => {
			location.reload()
		}
	});
})

const removeFile = () => {
	$.ajax({
		url: "/api/remove-file",
		method: "POST",
		headers: {
			"X-CSRFToken": csrfToken
		},
		data: {
			path: getPath(),
			name: $(`.table > div:nth-child(${selectedItem}) span`).text()
		},
		success: () => {
			location.reload();
		}
	});
}

const download = async (url, filename) => {
	const slider = $('#download-file .slider')
	const filenameContianer = $('#download-file p:first-child')
	const indicator = $('#download-file .indicator')

	const sliderWidth = slider.width();
	
	slider.empty()
	slider.append('<div class="h-full bg-indigo-400 rounded-full w-0 transition-all duration-500"></div>');
	const sliderInner = slider.children()[0]
	$("#download-file").removeClass("invisible").addClass('black-op-bg');

	filenameContianer.text('Preparing file')
	fetch(url)
		.then(response => {
			const contentEncoding = response.headers.get('content-encoding');
			const contentLength = response.headers.get(contentEncoding ? 'x-file-size' : 'content-length');
			contentType = response.headers.get('content-type');
			if (contentLength === null) {
				throw Error('Response size header unavailable');
			}

			const total = parseInt(contentLength, 10);
			let loaded = 0;
			isDownloading = true

			return new Response(
				new ReadableStream({
					start(controller) {
						const reader = response.body.getReader();

						read();

						function read() {
							reader.read().then(({done, value}) => {
								if (done) {
									controller.close();
									filenameContianer.text('Downloading file')
									return;
								}
								if (!isDownloading) {
									controller.close()
									return;
								};
								loaded += value.byteLength;
								progress({loaded, total})
								controller.enqueue(value);
								read();
							}).catch(error => {
								console.error(error);
								controller.error(error)
							})
						}
					}
				})
			);
		})
		.then(response => response.blob())
		.then(blob => {
			if (isDownloading) {
				var a = document.createElement("a");
				a.href = URL.createObjectURL(blob);
				a.setAttribute("download", decodeURI(filename));
				a.click();
			}
		})
		.catch(error => {
			console.error(error);
		})

    function progress({loaded, total}) {
		const percentage = loaded / total * 100
        indicator.text(Math.round(percentage) + " %");
		sliderInner.style.width = Math.round(sliderWidth * loaded / total) + "px"
    }
}

const downloadFile = () => {
	const item = $(`.table > div:nth-child(${selectedItem}) > div`)[0];
	const {type, path} = item.dataset;
	
	if (type === "file") {
		const url = encodeURI(`${window.location.origin}/files/${path}`).replace('#', "%23");
		download(url, url.split('/')[url.split('/').length - 1])
	}
}

const downloadFileHide = () => $("#download-file").addClass("invisible").removeClass('black-op-bg');
const cancelDownload = () => {
	isDownloading = false;
	downloadFileHide()
}

$("#add-tag form").submit(e => {
	e.preventDefault();

	const tagName = $("#add-tag input").val().trim()
	const color = picker.element.dataset.color

	if (tagName) {
		$.ajax({
			url: "/api/add-tag",
			method: "POST",
			headers: {
				"X-CSRFToken": csrfToken
			},
			data: {
				path: getPath(),
				name: $(`.table > div:nth-child(${selectedItem}) span`).text(),
				tag: tagName,
				color: color
			},
			success: () => {
				addTagPromptHide()
				setTimeout(() => {location.reload();}, 500)
			}
		})
	}
})