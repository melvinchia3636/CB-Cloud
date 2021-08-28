const ps = new PerfectScrollbar('.tab');
let selectedItem = null;
let dragTo;

const goto = (path, id, type) => {
	if (selectedItem == id) {
		if (type === "folder") {
			window.location += (!(window.location.href[window.location.href.length-1] === "/") ? "/" : "") + path
		} else {
			window.open(encodeURI(`${window.location.origin}/files/${path}`).replace('#', "%23"), "_blank")
		}
	} else {
		if (selectedItem) $(`.table div:nth-child(${selectedItem}) > div > div`).removeClass('bg-indigo-200')
		selectedItem = id
		$(`.table div:nth-child(${selectedItem}) > div > div`).addClass('bg-indigo-200')
		$("#func-tools, #func-tools + div").removeClass('hidden').addClass('flex')
	}
}


const arrow = `<svg class="mt-0.5" width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M3.375 7.5L6.375 4.5L3.375 1.5" stroke="#5E78FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
paths = window.location.pathname.split('/').filter(e => e)
paths = paths.map((e, i) => {
	return `<a href="/${paths.slice(0, i+1).join('/')}">${decodeURI(e)}</a>`
})
$('#breadcrumb').append(paths.slice(0, paths.length-1).join(arrow))
$('#breadcrumb').append(`${paths.length > 1 ? arrow : ""}<span class='font-bold'>${paths[paths.length-1]}</span>`)

const newFolderPromptShow = () => {
	$("#folder-create").removeClass("invisible").addClass('black-op-bg')
	$(".add > div").removeClass('show');
	setTimeout(function() { $('#folder-create input:first-child()').focus() }, 500);
}

const newFolderPromptHide = () => {
	$("#folder-create").addClass("invisible").removeClass('black-op-bg')
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
			path: paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML),
			name: folderName
		},
		success: () => {
			newFolderPromptHide()
			setTimeout(() => {location.reload();}, 500)
		}
	})
})

$(".add > button").click(() => {
	$(".add > div").addClass('show')
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
	dragTo = e.over
});

droppable.on('droppable:stop', e => {
	const source = e.dropzone.children[0].querySelector('span').innerText;
	const target = dragTo.querySelector('span').innerText
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
				path: paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML)
			},
			success: () => {
				location.reload()
			}
		})
	}
});

const uploadFile = () => {
	$(".add > div").removeClass('show');
	$('#upload').trigger('click')
}

$('#upload').on("change", function () {
	const formdata = new FormData();
	for (file of this.files) {
		formdata.append("files[]", file)
	}
	paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML).forEach(e => {
		formdata.append('path[]', e)
	})

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
	})
})

const removeFile = () => {
	$.ajax({
		url: "/api/remove-file",
		method: "POST",
		headers: {
			"X-CSRFToken": csrfToken
		},
		data: {
			path: paths.map(e => HTMLParser.parseFromString(e, "text/xml").children[0].innerHTML),
			name: $(`.table > div:nth-child(${selectedItem}) span`).text()
		},
		success: () => {
			location.reload()
		}
	})
}