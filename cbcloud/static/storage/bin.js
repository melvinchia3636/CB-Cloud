const ps = new PerfectScrollbar('.tab');
let selectedItem = null;

const goto = (path, id, type) => {
	if (selectedItem == id) {
		
	} else {
		if (selectedItem) $(`.table div:nth-child(${selectedItem}) > div > div`).removeClass('bg-indigo-200')
		selectedItem = id
		$(`.table div:nth-child(${selectedItem}) > div > div`).addClass('bg-indigo-200')
		$("#func-tools, #func-tools + div").removeClass('hidden').addClass('flex')
	}
}

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