const zeroPad = (num, places) => String(num).padStart(places, '0')


function convertDEGToDMS(deg, lat) {
    const absolute = Math.abs(deg);

    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    if (lat) {
        var direction = deg >= 0 ? "N" : "S";
    } else {
        var direction = deg >= 0 ? "E" : "W";
    }

    return `<span class="text-purple-500">${degrees + "° " + minutes + "' " + seconds + "\" " + direction}</span>`;
}

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
let isErroring2 = false;

$("#collection-create input").on('input', e => {
	if ($("#collection-create input").first().val().trim()) $("#collection-create input").last().prop('disabled', false).addClass('bg-indigo-400 text-white').removeClass('bg-gray-300 text-gray-400')
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

const showError2 = content => {
	if (isErroring2) $("#document-create input").first().parent().parent().find("p").remove()
	isErroring2 = true;
	$("#document-create input").first().parent().addClass('border-red-400 mb-2');
	$(`<p class="text-red-500 font-semibold mb-4 flex items-center">
		<span class="iconify w-5 h-5 mr-1" data-icon="uil:exclamation-circle"></span>
		${content}
	</p>`).insertAfter($("#document-create input").first().parent())
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
	fetchDocuments($(collection).text().trim())
}

const fetchDocuments = collection => {
	if (collection) $(".doc-title").text($(collection).text() || collection);
	else $('.doc-add').css("display", "none");
	$.ajax({
		url: "/api/fetch-document",
		data: {
			collection: collection
		},
		success: res => {
			$('.docs').empty()
			if (res) {
				$('.docs').append(res.map((e, i) => `
				<div class="${!i ? "bg-indigo-200 text-indigo-400 flex items-center justify-between" : ""} bg-white w-full py-3 px-4 font-bold text-xl flex items-center document-list-item transition-all cursor-pointer gap-4" ${i ? `onclick='changeDocument(this)'`: ""}>
					<span class="overflow-hidden overflow-ellipsis block">${e}</span>
					${!i ? '<span class="iconify w-7 h-7 flex-shrink-0" data-icon="uil:angle-right"></span>' : ""}
				</div>
				`).join(''));
				fetchDocContent(res[0])
			} else {
				fetchDocContent('')
			}
			const ps = new PerfectScrollbar('.docs');
		}
	})
}

const changeDocument = document => {
	$(".docs > div > svg").remove()
	$(".docs > div").removeClass("bg-indigo-200 text-indigo-400 flex items-center justify-between").attr("onclick", 'changeDocument(this)')
	$(document).addClass("bg-indigo-200 text-indigo-400 flex items-center justify-between").removeAttr("onclick").append('<span class="iconify w-7 h-7 flex-shrink-0" data-icon="uil:angle-right"></span>')
	fetchDocContent($(document).text().trim())
}

const updateDocument = name => {
	$('.docs').append(
		`<div class="bg-white w-full py-3 px-4 font-bold text-xl flex items-center document-list-item transition-all cursor-pointer new" onclick='changeDocument(this)'>
			${name}
		</div>`
	);
	$(".new").click();
	$(".new").removeClass(".new");
}

const fetchDocContent = document => {
	const collection = $('.database-list-item.bg-indigo-200').text().trim();
	if (document) {$('.doc-content-add').css("display", "flex"); $(".doc-content-title").text($(document).text() || document);}
	else $('.doc-content-add').css("display", "none");
	$.ajax({
		url: "/api/fetch-doc-content",
		data: {
			collection,
			document
		},
		success: res => {
			$('.doc-content').empty()
			if (res) {
				$('.doc-content').append(generateDocContentDOM(res))
			}
			const ps = new PerfectScrollbar('.doc-content');
		}
	})
}

$(document).ready(function() {
	$('select').niceSelect();
	$('.field .option').click(e => updateFieldType(e));
	stringField($('.field'));
	Scrollbar.init(document.querySelector("#document-create > div"));
	appendField($('.fields > .last a'));
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
	appendField($('.fields > .last a'));

	if (isErroring2) {
		const entryBox = $("#document-create input");
		entryBox.first().parent().next().remove()
		entryBox.parent().removeClass('border-red-400 mb-2');
		isErroring2 = false;
		$('.entry').addClass("border-indigo-400")
	}
}

$('.entry > input[type="text"]').focus(() => {
	if (!isErroring2) $('.entry').addClass("border-indigo-400")
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

$("#document-create input").first().on('input', e => {
	const entryBox = $("#document-create input");
	if (entryBox.first().val().trim()) entryBox.last().prop('disabled', false).addClass('bg-indigo-400 text-white').removeClass('bg-gray-300 text-gray-400')
	else entryBox.last().prop('disabled', true).removeClass('bg-indigo-400 text-white').addClass('bg-gray-300 text-gray-400')

	if (isErroring2) {
		entryBox.first().parent().next().remove()
		entryBox.parent().removeClass('border-red-400 mb-2');
		isErroring2 = false;
		$('.entry').addClass("border-indigo-400")
	}
})

const appendField = btn => {
	const template = $($('#value-field').html());
	$(btn).parent().parent().before(template);
	$('select').niceSelect();
	$('.field .option').click(e => updateFieldType(e));
	stringField($(template))
}


const appendArrayField = btn => {
	const template = $($('#value-field').html());
	const index = $(btn).parent().parent().parent().children(".field").length-1;
	template.find(".field-name").empty().append(`
		<div class="font-semibold bg-white relative pl-3">${index}</div>
	`);
	template.find('div:first-child').parent().css('align-items', "center");
	$(btn).parent().parent().before(template);
	$('select').niceSelect();
	$('.field .option').click(e => updateFieldType(e));
	stringField($(template))
}

const removeField = btn => {
	$($(btn).parents('.field')[0]).remove()
}

const updateFieldType = e => {
	const newType = e.target.innerHTML;
	const field = $($(e.target).parents('.field')[0]);
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

		case "timestamp":
			timestampField(field);
			break;

		case "map":
			mapField(field);
			break;

		case "array":
			arrayField(field);
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
	field.find('.bool, .geo, .timestamp').css('display', 'none');
	field.find('.map, .array').remove()
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

const timestampField = field => {
	fieldDisplay(field, true);
	field.find('.timestamp').css('display', 'flex');
}

const mapField = field => {
	const template = $($('#map-fields').html());
	fieldDisplay(field, true);
	field.append(template);
	appendField(template.find('.last a'));
}

const arrayField = field => {
	const template = $($('#array-fields').html());
	fieldDisplay(field, true);
	field.append(template);
	appendArrayField(template.find('.last a'));
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

const datePickerShow = e => {
	$("#date-picker").removeClass("invisible").addClass('black-op-bg');
	$(".add > div").removeClass('show');
	const input = $('#date-picker input:first-child()').val('');
	setTimeout(function() { input.focus() }, 500);

	if (date = new Date($(e).parent().find('input').val())) {
		if (date instanceof Date && !isNaN(date.valueOf())) {
			generateCalendar(date, true);
			return
		}
	}

	const today = new Date();
	generateCalendar(today);
	$('.today').addClass('picked');
	pickDate = funcPickDate.bind($(e).parent())
}

const datePickerHide = () => {
	$("#date-picker").addClass("invisible").removeClass('black-op-bg');
}

const generateCalendar = (date, useDate) => {
	const months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
	const year = 1900 + date.getYear();
	const month = date.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const daysCount = new Date(year, month+1, 0).getDate();
	const days = Array(firstDay).fill(0).concat(Array(daysCount).fill().map((_, i) => i+1));
	const today = new Date();

	$("#date-picker .ym").text(`${months[month]} ${year}`).attr("id", `${month}-${year}`);

	$('.calendar').empty().append(Array(6).fill().map(() => `<div class="flex justify-center gap-8 mb-6 font-semibold">${`<p class="w-6 flex justify-center items-center" onclick="setDate(this)">&nbsp;</p>`.repeat(7)}</div>`).join("")).find("p").each((_, e) => (d = days.shift()) ? $(e).addClass('day').addClass(today.getMonth() === month && today.getYear() === year - 1900 && d === today.getDate() ? "today": "").addClass((useDate && date.getDate() === d) ? "picked" : "").empty().append(`<span class="relative">${d}</span>`) : null);
}

var pickDate;

function funcPickDate() {
	const date = parseInt($('.calendar .day.picked').text());
	if (!isNaN(date)) {
		const [month, year] = $("#date-picker .ym").attr('id').split("-").map(e => parseInt(e));
		this.find("input").val(`${zeroPad(month+1, 2)}/${zeroPad(date, 2)}/${year}`);
		datePickerHide();
	}
	
}

const gotoMonth = direction => {
	const [month, year] = $("#date-picker .ym").attr('id').split("-").map(e => parseInt(e));
	const date = new Date(year, month, 1);
	generateCalendar(new Date(date.setMonth(date.getMonth() + (direction ? 1 : -1))))
}

const setDate = e => {
	$('.calendar p').removeClass("picked");
	$(e).addClass("picked");
}

$("#document-create form").submit(e => {
	e.preventDefault()

	const collectionName = $('.database-list-item.bg-indigo-200').text().trim();
	const documentName = $("#document-create input:first-child").val().trim();
	const data = fetchDocData($('.fields').first());
	
	if (collectionName && documentName) {
		if (documentName.match(/^([0-9]|[a-z]|_)+([0-9a-z_]+)$/i)) {
			$.ajax({
				url: "/api/create-document",
				method: "POST",
				headers: {
					"X-CSRFToken": csrfToken
				},
				data: {
					document: documentName,
					collection: collectionName,
					data: JSON.stringify(data)
				},
				success: () => {
					newDocumentPromptHide();
					updateDocument(documentName)
				},
				error: e => {
					if (e.status === 409 && e.responseText === "existed") showError2("Collection already existed")
					else showError2("Unexpected Error")
				}
			})
		} else {
			showError2("Only alphanumeric characters allowed")
		}
	} else {
		showError2("Must specify document name")
	}
})

const fetchDocData = (e, isArr) => {
	const data = isArr ? [] : {};
	e.children(".field:not(.last)").each((_, e) => {
		const type = $(e).find(".current").first().text();
		switch (type) {
			case "string":
				if (isArr) {
					data.push([0, $(e).find(".val").first().val()]);
					break
				}
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [0, $(e).find(".val").first().val()];
				}
				break;

			case "number":
				if (isArr) {
					if (value && !isNaN(parseFloat(value)) && isFinite(value)) {
						data.push([1, parseFloat(value)])
					}
					break;
				}
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					const value = $(e).find(".val").first().val();
					if (value && !isNaN(parseFloat(value)) && isFinite(value)) {
						data[n] = [1, parseFloat(value)]
					}
				}
				break;

			case "boolean":
				if (isArr) {
					data.push([2, $(e).find(".bool .current").first().text() == "true" ? true : false]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [2, $(e).find(".bool .current").first().text() == "true" ? true : false];
				}
				break;

			case "null":
				if (isArr) {
					data.push([3, null]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [3, null];
				}
				break;

			case "map":
				if (isArr) {
					data.push([4, fetchDocData($(e).find('.fields.map').first())]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [4, fetchDocData($(e).find('.fields.map').first())]
				}
				break;

			case "array":
				if (isArr) {
					data.push([5, fetchDocData($(e).find('.fields.array').first(), true)]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [5, fetchDocData($(e).find('.fields.array').first(), true)]
				}
				break;

			case "timestamp":
				if (isArr) {
					data.push([6, [$(e).find(".date").val(), $(e).find(".time").val()]]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [6, [$(e).find(".date").val(), $(e).find(".time").val()]]
				}
				break;

			case "geopoint":
				if (isArr) {
					data.push([6, [$(e).find(".lat").val(), $(e).find(".lon").val()]]);
					break;
				};
				if (n = $(e).find(".field-name").first().find("input").val().trim()) {
					data[n] = [6, [$(e).find(".lat").val(), $(e).find(".lon").val()]]
				}
				break;
		
			default:
				break;
		}
	});
	return data;
}

const generateDocContentDOM = res => {
	const dom = $(document.createDocumentFragment());
	Object.entries(res).map(([key, [type, value]]) => {
		const item = $(document.createDocumentFragment());
		switch (type) {
			case 0: case 1:
				item.append(`
				<div class="bg-white w-full py-1 px-5 font-semibold text-lg flex items-center item transition-all cursor-pointer gap-4">
						<span class="text-gray-500">${key}:</span> <span class="text-xl">${value}</span>
					</div>
				`);
				break;

				case 2:
					item.append(`
					<div class="bg-white w-full py-1 px-5 font-semibold text-lg flex items-center item transition-all cursor-pointer gap-4">
							<span class="text-gray-500">${key}:</span> <span class="${value ? "text-green-500" : "text-red-500"} text-xl">${value}</span>
						</div>
					`);
					break;

				case 3:
					item.append(`
					<div class="bg-white w-full py-1 px-5 font-semibold text-lg flex items-center item transition-all cursor-pointer gap-4">
							<span class="text-gray-500">${key}:</span> <span class="text-red-800 text-xl">${value}</span>
						</div>
					`);
					break;

				case 6:
					item.append(`
					<div class="bg-white w-full py-1 px-5 font-semibold text-lg flex items-center item transition-all cursor-pointer gap-4">
							<span class="text-gray-500">${key}:</span> <span class="text-xl">[${value.map((e, i) => convertDEGToDMS(e, i)).join(", ")}]</span>
						</div>
					`);
					break;
		
			default:
				break;
		}
		dom.append(item);
	})
	return dom;
}