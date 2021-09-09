const newCollectionPromptShow = () => {
	$("#collection-create").removeClass("invisible").addClass('black-op-bg');
	$(".add > div").removeClass('show');
	const input = $('#collection-create input:first-child()').val('');
	setTimeout(function() { input.focus() }, 500);
}

const newCollectionPromptHide = () => {
	$("#collection-create").addClass("invisible").removeClass('black-op-bg');
}

let isErroring = false;

$("#collection-create input").on('input', e => {
	if (isErroring) {
		$("#collection-create input").first().next().remove()
		$("#collection-create input").removeClass('border-red-400 mb-2');
		isErroring = false;
	}
})

const showError = content => {
	isErroring = true;
	$("#collection-create input").addClass('border-red-400 mb-2');
	$(`<p class="text-red-500 font-semibold mb-4 flex items-center">
		<span class="iconify w-5 h-5 mr-1" data-icon="uil:exclamation-circle"></span>
		${content}
	</p>`).insertAfter($("#collection-create input")[0])
}

$("#collection-create form").submit(e => {
	e.preventDefault()

	const collectionName = $("#collection-create input").val().trim();
	
	if (collectionName) {
		if (collectionName.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)) {
			$.ajax({
				url: "/api/create-collection",
				method: "POST",
				headers: {
					"X-CSRFToken": csrfToken
				},
				data: {
					name: collectionName
				},
				success: () => {
					newCollectionPromptHide()
					updateCollection(collectionName)
				},
				error: e => {
					if (e.status === 409 && e.responseText === "existed") showError("Collection already existed")
				}
			})
		} else {
			showError("Only alphanumeric characters allowed")
		}
	} else {
		showError("Must specify collection name")
	}
})

const updateCollection = name => {
	$('.coll').append(
		`<div class="bg-white w-full py-3 px-4 font-bold text-xl flex items-center database-list-item transition-all cursor-pointer">
			${name}
		</div>`
	);
	$(".coll > div").sort(function(a,b) {
		return ('' + $(a).text()).localeCompare($(b).text());
   	}).appendTo(".coll")
}

$.ajax({
	url: "/api/fetch-collections",
	method: "GET",
	success: res => {
		$('.coll').append(res.map(e => `
		<div class="bg-white w-full py-3 px-4 font-bold text-xl flex items-center database-list-item transition-all cursor-pointer">
			${e}
		</div>
		`).join(''));
		const ps = new PerfectScrollbar('.coll');
	}
})