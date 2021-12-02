'use strict';

const ps = new PerfectScrollbar('.tab');
let selectedItem = null;
let dragTo;
let isDownloading;
let viewType = localStorage.getItem("viewType") || "grid"

$('button[onclick="changeView(this)"]').children().replaceWith(`<span class="iconify w-7 h-7 text-gray-700" data-icon="tabler:layout-${viewType}"></span>`)
$(`.file-${viewType}`).removeClass("hidden")

const arrow = `<svg class="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
let paths = window.location.pathname.split('/').filter(e => e);
paths = paths.map((e, i) => {
	return `<a href="/${paths.slice(0, i+1).join('/')}">${decodeURI(e)}</a>`;
})
const getPath = () => paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML);
$('#breadcrumb').append(paths.slice(0, paths.length - 1).join(arrow));
$('#breadcrumb').append(`${paths.length > 1 ? arrow : ""}<span class='font-bold'>${paths[paths.length-1]}</span>`);

const button = document.getElementById('color-pick');
let picker = new ColorPicker(button, '#5E78FF');

const goto = (item, id) => {
	const {
		path,
		type
	} = item.dataset;
	if (selectedItem == id) {
		if (type === "folder") {
			window.location += (!(window.location.href[window.location.href.length - 1] === "/") ? "/" : "") + path;
		} else {
			const _path = path.toLowerCase().split(".")
			if (["jpg", "png"].includes(_path[_path.length - 1])) {
				openImageViewer(path)
			} else {
				window.open(encodeURI(`${window.location.origin}/files/${path}`).replace('#', "%23"), "_blank");
			}
		}
	} else {
		if (selectedItem) $(`.table div:nth-child(${selectedItem}) > div > div`).removeClass('bg-indigo-200');
		selectedItem = id;
		$(`.table > div:nth-child(${selectedItem}) > div > div`).addClass('bg-indigo-200');
		$("#func-tools, #func-tools + div").removeClass('hidden').addClass('flex');
	}
}

const newFolderPromptShow = () => {
	$("#folder-create").removeClass("invisible").addClass('black-op-bg');
	$(".add > div").removeClass('show');
	setTimeout(function() {
		$('#folder-create input:first-child()').focus()
	}, 500);
}

const newFolderPromptHide = () => {
	$("#folder-create").addClass("invisible").removeClass('black-op-bg');
}

const addTagPromptHide = () => {
	$("#add-tag").addClass("invisible").removeClass('black-op-bg');
}

const addTagPromptShow = () => {
	$('#add-tag input:first-child()').val("")
	$("#add-tag").removeClass("invisible").addClass('black-op-bg');
	setTimeout(function() {
		$('#add-tag input:first-child()').focus()
	}, 500);
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
			setTimeout(() => {
				location.reload();
			}, 500)
		}
	});
})

$(".add > button").click(() => {
	$(".add > div").addClass('show');
})

$('body').on('click', function(e) {
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

$('#upload').on("change", function() {
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
	console.log(getPath())
	$.ajax({
		url: "/api/remove-file",
		method: "POST",
		headers: {
			"X-CSRFToken": csrfToken
		},
		data: {
			path: getPath(),
			name: $(`.table > div:nth-child(${selectedItem}) span`).eq(0).text()
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
			const contentType = response.headers.get('content-type');
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
							reader.read().then(({
								done,
								value
							}) => {
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
								progress({
									loaded,
									total
								})
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

	function progress({
		loaded,
		total
	}) {
		const percentage = loaded / total * 100
		indicator.text(Math.round(percentage) + " %");
		sliderInner.style.width = Math.round(sliderWidth * loaded / total) + "px"
	}
}

const downloadFile = () => {
	const item = $(`.table > div:nth-child(${selectedItem}) > div`)[0];
	const {
		type,
		path
	} = item.dataset;

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
				name: $(`.table > div:nth-child(${selectedItem}) span`).eq(0).text(),
				tag: tagName,
				color: color
			},
			success: () => {
				addTagPromptHide()
				setTimeout(() => {
					location.reload();
				}, 500)
			}
		})
	}
})

$('.file-row').contextmenu(e => {
	e.preventDefault();
	e.target.click();
	const {
		clientX,
		clientY
	} = e.originalEvent;
	$(".cm-cover").addClass("block");
	$('.contextmenu').addClass("h-56").css("top", clientY + "px").css("left", clientX + "px")
})

$(".cm-cover").click(() => {
	$('.contextmenu').removeClass("h-56")
	$(".cm-cover").removeClass("block")
})

$(".cm-cover").contextmenu(e => {
	e.preventDefault();
	$('.contextmenu').removeClass("h-56")
	$(".cm-cover").removeClass("block")
})

const openImageViewer = (path) => {
	const allImages = $(".file-row").children().map((_, e) => e.dataset.path).get().filter(e => {
		const path = e.split(".");
		return ["jpg", "png"].includes(path[path.length - 1].toLowerCase())
	})
	$(".image-container").attr("src", `${window.location.origin}/files/${path}`.replace('#', "%23")).attr("data-index", allImages.indexOf(path))
	$(".other-images").empty().append(allImages.map((e, i) => `<img data-index="${i}" class="h-16 ${e === path ? "current-image" : ""}" src="${`${window.location.origin}/files/${e}`.replace('#', "%23")}" />`).join(""))
	$(".img-viewer, .img-viewer-cover").removeClass("hidden")
	setTimeout(() => {
		$(".img-viewer-cover").addClass("opacity-100")
		$(".img-viewer").addClass("-translate-y-1/2")
		setTimeout(() => {
			$('.other-images .current-image')[0].scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});
		}, 400)
	}, 10)
}

const closeImageViewer = () => {
	$(".img-viewer-cover").removeClass("opacity-100")
	$(".img-viewer").removeClass("-translate-y-1/2")
	setTimeout(() => {
		$(".img-viewer, .img-viewer-cover").addClass("hidden")
	}, 510)
}

const imgViewerNextImage = () => {
	const allImages = $(".file-row").children().map((_, e) => e.dataset.path).get().filter(e => {
		const path = e.split(".");
		return ["jpg", "png"].includes(path[path.length - 1])
	})
	let pathIndex = parseInt($(".image-container")[0].dataset.index, 10) + 1;
	pathIndex = pathIndex >= allImages.length ? 0 : pathIndex
	$(".image-container").attr("src", `${window.location.origin}/files/${allImages[pathIndex]}`.replace('#', "%23")).attr("data-index", pathIndex)
	$(".other-images .current-image").removeClass("current-image")
	$(`.other-images img[data-index=${pathIndex}]`).addClass("current-image")[0].scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'center'
	});
}

const imgViewerLastImage = () => {
	const allImages = $(".file-row").children().map((_, e) => e.dataset.path).get().filter(e => {
		const path = e.split(".");
		return ["jpg", "png"].includes(path[path.length - 1])
	})
	let pathIndex = parseInt($(".image-container")[0].dataset.index, 10) - 1;
	pathIndex = pathIndex < 0 ? allImages.length - 1 : pathIndex
	$(".image-container").attr("src", `${window.location.origin}/files/${allImages[pathIndex]}`.replace('#', "%23")).attr("data-index", pathIndex)
	$(".other-images .current-image").removeClass("current-image")
	$(`.other-images img[data-index=${pathIndex}]`).addClass("current-image")[0].scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'center'
	});
}

const changeView = e => {
	if (viewType === "list") {
		viewType = "grid"
		$(".file-list").fadeOut(100)
		setTimeout(() => {
			$(".file-grid").fadeIn(100)
		}, 100);
	} else {
		viewType = "list"
		$(".file-grid").fadeOut(200)
		$(".file-list").fadeIn(200)
	}
	localStorage.setItem("viewType", viewType)
	$(e).children().replaceWith(`<span class="iconify w-7 h-7 text-gray-700" data-icon="tabler:layout-${viewType}"></span>`)
}