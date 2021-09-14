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
	if ($("#collection-create input").first().val()) $("#collection-create input").last().prop('disabled', false).addClass('bg-indigo-400 text-white').removeClass('bg-gray-300 text-gray-400')
	else $("#collection-create input").last().prop('disabled', true).removeClass('bg-indigo-400 text-white').addClass('bg-gray-300 text-gray-400')

	if (isErroring) {
		$("#collection-create input").first().next().remove()
		$("#collection-create input").removeClass('border-red-400 mb-2');
		isErroring = false;
	}
})

const showError = content => {
	if (isErroring) $("#collection-create input").first().next().remove()
	isErroring = true;
	$("#collection-create input").addClass('border-red-400 mb-2');
	$(`<p class="text-red-500 font-semibold mb-4 flex items-center">
		<span class="iconify w-5 h-5 mr-1" data-icon="uil:exclamation-circle"></span>
		${content}
	</p>`).insertAfter($("#collection-create input")[0])
}

$("#collection-create form").submit(e => {
	e.preventDefault()

	const collectionName = $("#collection-create input").val().trim().toLowerCase();
	
	if (collectionName) {
		if (collectionName.match(/^([0-9]|[a-z]|_)+([0-9a-z_]+)$/i)) {
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
		`<div class="bg-white w-full py-3 px-4 font-bold text-xl flex items-center database-list-item transition-all cursor-pointer new" onclick='changeCollection(this)'>
			${name}
		</div>`
	);
	$(".new").click();
	$(".new").removeClass(".new");
	$(".coll > div").sort(function(a,b) {
		return ('' + $(a).text()).localeCompare($(b).text());
   	}).appendTo(".coll");
	$('.doc-add').css("display", "flex")
}

$.ajax({
	url: "/api/fetch-collections",
	method: "GET",
	success: res => {
		if (res) {
			$('.coll').append(res.map((e, i) => `
			<div class="${!i ? "bg-indigo-200 text-indigo-400 flex items-center justify-between" : ""} bg-white w-full py-3 px-4 font-bold text-xl flex items-center database-list-item transition-all cursor-pointer gap-4" ${i ? `onclick='changeCollection(this)'`: ""}>
				<span class="overflow-hidden overflow-ellipsis block">${e}</span>
				${!i ? '<span class="iconify w-7 h-7 flex-shrink-0" data-icon="uil:angle-right"></span>' : ""}
			</div>
			`).join(''));
			fetchDocuments(res[0])
		} else {
			fetchDocuments('')
		}
		const ps = new PerfectScrollbar('.coll');
	}
})

const changeCollection = collection => {
	$(".coll > div > svg").remove()
	$(".coll > div").removeClass("bg-indigo-200 text-indigo-400 flex items-center justify-between").attr("onclick", 'changeCollection(this)')
	$(collection).addClass("bg-indigo-200 text-indigo-400 flex items-center justify-between").removeAttr("onclick").append('<span class="iconify w-7 h-7 flex-shrink-0" data-icon="uil:angle-right"></span>')
	fetchDocuments(collection)
}

const fetchDocuments = collection => {
	if (collection) $(".doc-title").text($(collection).text() || collection);
	else $('.doc-add').css("display", "none");
	/*
	$.ajax({
		url: "api-fetch-document"
	})
	*/
}

$(document).ready(function() {
	$('select').niceSelect();
	$('.field .option').click(e => updateFieldType(e))
	stringField($('.field'))
})

const newDocumentPromptShow = () => {
	$('.entry > input[type="text"]').parent().children("a").text('Auto-ID')
	$("#document-create").removeClass("invisible").addClass('black-op-bg');
	$(".add > div").removeClass('show');
	const input = $('.entry input:first-child()').val('');
	setTimeout(function() { input.focus() }, 500);
}

const newDocumentPromptHide = () => {
	$("#document-create").addClass("invisible").removeClass('black-op-bg');
	$(".fields > .field:not(:last-child)").remove();
	appendField($('.fields > .last a'))
}

$('.entry > input[type="text"]').focus(() => {
	$('.entry').addClass("border-indigo-400")
}).blur(() => {
	$('.entry').removeClass("border-indigo-400")
});

function makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = 20;
    for ( var i = 0; i < charactersLength; i++ ) {
    	result += characters.charAt(Math.floor(Math.random() * characters.length));
   	}
   return result;
}

const generateAutoID = e => {
	$(e).parent().children("input[type='text']").val(makeid());
	$(e).text('');
	$("#document-create input").last().prop('disabled', false).addClass('bg-indigo-400 text-white').removeClass('bg-gray-300 text-gray-400')
	$('.entry > input[type="text"]').focus()
}

$('.entry > input[type="text"]').on("input", e => {
	const autoIdBtn = $('.entry > input[type="text"]').parent().children("a");
	if ($('.entry > input[type="text"]').val().trim()) autoIdBtn.text('');
	else autoIdBtn.text('Auto-ID')
})

$("#document-create input").on('input', e => {
	const entryBox = $("#document-create input");
	if (entryBox.first().val()) entryBox.last().prop('disabled', false).addClass('bg-indigo-400 text-white').removeClass('bg-gray-300 text-gray-400')
	else entryBox.last().prop('disabled', true).removeClass('bg-indigo-400 text-white').addClass('bg-gray-300 text-gray-400')

	if (isErroring) {
		entryBox.first().next().remove()
		entryBox.removeClass('border-red-400 mb-2');
		isErroring = false;
	}
})

const appendField = btn => {
	const template = $($('#value-field').html());
	$(btn).parent().parent().before(template);
	$('select').niceSelect();
	$('.field .option').click(e => updateFieldType(e));
	stringField($(template))
}

const removeField = btn => {
	$(btn).parents('.field').remove()
}

const updateFieldType = e => {
	const newType = e.target.innerHTML;
	const field = $(e.target).parents('.field');
	switch (newType) {
		case "string":
			stringField(field);
			break;

		case "number":
			numberField(field);
			break;

		case "boolean":
			booleanField(field);
			break;

		case "null":
			nullField(field);
			break;

		case "geopoint":
			geoField(field);
			break;
	
		default:
			break;
	}
}

const showFieldError = (field, content) => {
	if (!$(field).parent().parent().children('.error').length) {
		$(field).parent().parent().append(`
			<div class="text-red-500 mt-1 flex items-center error">
				<span class="iconify w-5 h-5 mr-1" data-icon="uil:exclamation-circle"></span>
				<p class="text-red-500 font-semibold">${content}</p>
			</div>
		`)
		return;
	}

	if ($(field).parent().parent().find('.error > p').text() !== content) {
		$(field).parent().parent().find('.error > p').text(content);
	}
}

const removeFieldError = field => {
	$(field).parent().parent().children('.error').remove()
}

const fieldDisplay = (field, hide) => {
	field.find('.bool, .geo').css('display', 'none');
	field.find('* > .val:first-child').val("").css('display', hide ? "none" : "flex").parent().parent().parent().css('align-items', hide ? "center" : 'flex-start')
}

const stringField = field => {
	fieldDisplay(field);
	removeFieldError(field.find('.val'));
}

const nullField = field => {
	fieldDisplay(field, true);
	field.find('.error').remove()
}

const booleanField = field => {
	fieldDisplay(field, true);
	field.find('.bool').css('display', 'initial');
	$('select').niceSelect();
}

const geoField = field => {
	fieldDisplay(field, true);
	field.find('.geo').css('display', 'flex');
}

const numberField = field => {
	fieldDisplay(field)
	const checkNum = (f, emptyCheck) => {
		const value = $(f).val().trim();
		if (!value && emptyCheck) showFieldError(f, "Required")
		else if (value &&!(!isNaN(parseFloat(value)) && isFinite(value))) showFieldError(f, "Must be a number")
		else removeFieldError(f);
	}
	checkNum($(field).find('.val'), false);
	$(field).find('.val').off('input').on('input', e => checkNum(e.target, true))
}