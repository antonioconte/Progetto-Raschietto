$(document).ready(function() {
	$("#modal-changes .table-edit-note").hide();
	$("#modal-details .target-edit").hide();
	// Nasconde l'intestazione della tabella delle modifiche
	$("#modal-changes .save-on-store").attr("disabled", "disabled");

	// Cambia il widget a seconda del tipo di annotazione selezionata
	$(document).on('change', '#modal-details div.modal-body table tr:nth-child(2) select', function() {
		var modalblock = $(document).find('#modal-details');
		var val = $(this).val();
		getWidget(modalblock, val);
	});

	// Apre la modal dei dettagli dell'annotazione
	$(document).on('click', '.openblock', function() {
		getModal($(this).parent().attr('id') - 1);
		$('#modal-details').modal();
		modalVisible = true;
	});

	// Rende i campi della modal modificabili
	$(document).on('click', '#modal-details .edit', function() {
		var modalblock = $(document).find('#modal-details');
		var type = modalblock.find('table td:eq(1)').html();
		// cella relativa al tipo di annotazione
		modalblock.find('table .ann-label').each(function() {
			var val = $(this).html();
			$(this).html('<textarea class="form-control" rows="2" cols="50">' + val + '</textarea>');
		});
		// modalblock.find('.modal-body').each(function() {
			// $(this).append('<tr class="tr_target"><td><button title="Modifica target" id="btn_target">Modifica Target</button></td></tr>');
		// });
		getWidget(modalblock, type);
		modalblock.find('.target-edit').show();
		$(this).removeClass("edit");
		$(this).addClass("confirm");
		$(this).html("Conferma");
	});

	// Aggiorna arrayNewRes con le modifiche locali
	function updateTable(artID, annID, cited) {
		var save = '<i class="save-ann fa fa-floppy-o fa-lg"></i>';
		var del = '<i class="delete-annM delete-ann fa fa-times fa-lg"></i>';
		var savedel = '<td>' + save + '</td><td>' + del + '</td>';
		var show = '<i class="show-ann fa fa-chevron-down"></i>';
		if (cited) {
			var newAnn = arrayNewResCited[artID][annID];
			var oldAnn = arrayOldResCited[artID][annID];
		} else {
			var newAnn = arrayNewRes[artID][annID];
			var oldAnn = arrayOldRes[artID][annID];
		}
		tr = '<tr class="' + newAnn['type'] + '" id="p' + artID + 'a' + annID + '"></tr>';
		$("#modal-changes .not_annot").hide();
		$("#modal-changes .table-edit-note").show();
		$("#modal-changes .table-edit-note").append(tr);
		var row = $("#modal-changes .table-edit-note").find('#p' + artID + 'a' + annID);
		row.nextUntil("tr.sup").remove();
		row.addClass("sup");
		row.html('<td>' + show + '</td><td>' + loadedArticles[artID - 1] + '</td><td>[' + newAnn.label + '] ' + newAnn.body.label + '</td>' + savedel + '</tr>');
		row.after('<tr class="sub"><th>Campo</th><th>Valore salvato</th><th>Valore locale</th><th></th><th></th></tr>');
		var subrow = row.next();
		subrow.after('<tr class="sub"><td>Label</td><td>' + oldAnn.body.label + '</td><td>' + newAnn.body.label + '</td><td></td><td>' + del + '</td></tr>');
		var iterSubRow = subrow.next();
		//iterSubRow.after('<tr class="sub"><td>Tipo</td><td>' + oldAnn.label + '</td><td>' + newAnn.label + '</td><td>' + del + '</td></tr>');
		//iterSubRow = iterSubRow.next();
		if (oldAnn.label == 'Autore' || oldAnn.label == 'Citazione') {
			iterSubRow.after('<tr class="sub"><td>' + oldAnn.label + '</td><td>' + oldAnn.body.resource.label + '</td><td>' + newAnn.body.resource.label + '</td><td></td><td>' + del + '</td></tr>');
		} else if (oldAnn.label == 'Retorica') {
			iterSubRow.after('<tr class="sub"><td>' + oldAnn.label + '</td><td>' + getRhetoricLabel(oldAnn.body.literal) + '</td><td>' + getRhetoricLabel(newAnn.body.literal) + '</td><td></td><td>' + del + '</td></tr>');
		} else {
			iterSubRow.after('<tr class="sub"><td>' + oldAnn.label + '</td><td>' + oldAnn.body.literal + '</td><td>' + newAnn.body.literal + '</td><td></td><td>' + del + '</td></tr>');
		}
		iterSubRow = iterSubRow.next();
	    iterSubRow.after('<tr class="sub"><td>Target</td><td>' + oldAnn.target.id + '</td><td>' + newAnn.target.id + '</td><td></td><td>' + del + '</td></tr>');
		iterSubRow = iterSubRow.next();
		iterSubRow.after('<tr class="sub"><td>Start</td><td>' + oldAnn.target.start + '</td><td>' + newAnn.target.start + '</td><td></td><td>' + del + '</td></tr>');
		iterSubRow = iterSubRow.next();
		iterSubRow.after('<tr class="sub"><td>End</td><td>' + oldAnn.target.end + '</td><td>' + newAnn.target.end + '</td><td></td><td>' + del + '</td></tr>');
		
		row.nextUntil("tr.sup").hide();
		$("#modal-changes .save-on-store").removeAttr("disabled");
	}

	// Elimina una riga dalla tabella delle modifiche
	$(document).on('click', '#modal-changes .delete-ann', function() {
		var row = $(this).parent().parent();
		// Ripristina vecchi valori
		var id;
		if (row.hasClass("sup")) {// Ho bisogno dell'id della riga "padre"
			id = row.attr('id');
		} else {
			id = row.prevAll("tr.sup").first().attr("id");
		}
		var artID = id.substring(1, id.indexOf('a'));
		var annID = id.substring(id.indexOf('a') + 1);
		console.log(artID, annID);
		console.log(arrayNewRes[artID][annID]);
		if (row.hasClass("sup")) {
			arrayNewRes[artID][annID] = $.extend(true, {}, arrayOldRes[artID][annID]);
		} else {
			var field = row.children().first().text();
			if (field == 'Label') {
				arrayNewRes[artID][annID].body.label = arrayOldRes[artID][annID].body.label;
			}
		}
		// Rimuovi la riga dell'annotazione
		if (row.hasClass("sup")) {
			row.nextUntil("tr.sup").remove();
		}
		row.remove();
		if ($("#modal-changes").find("td").length == 0) {
			$("#modal-changes .table-edit-note").hide();
			// Nasconde l'intestazione della tabella delle modifiche
			$("#modal-changes .not_annot").show();
			$("#modal-changes .save-on-store").attr("disabled", "disabled");
		}
	});

	// Salva l'annotazione sul triplestore
	$(document).on('click', '#modal-changes .save-ann', function() {
		var row = $(this).parent().parent();
		// Ripristina vecchi valori
		var id;
		if (row.hasClass("sup")) {// Ho bisogno dell'id della riga "padre"
			id = row.attr('id');
		} else {
			id = row.prevAll("tr.sup").first().attr("id");
		}
		var artID = id.substring(1, id.indexOf('a'));
		var annID = id.substring(id.indexOf('a') + 1);
		console.log(artID, annID);
		console.log(JSON.stringify(arrayNewRes[artID][annID]));
		$.ajax({
			type : "POST",
			url : './php/note_editors/update.php',
			data : JSON.stringify(JSON.stringify(arrayOldRes[artID][annID]), JSON.stringify(arrayNewRes[artID][annID])]),
			contentType : "application/json; charset=utf-8",
			success : function(res) {
				console.log(res);
			},
			error : function() {
				alert("Errore durante l'aggionamento");
			}
		});
	});

	// Salva tutte le annotazioni sul triplestore
	$(document).on('click', '#modal-changes .save-on-store', function() {
		$("#modal-changes .table-edit-note").find('tr .save-ann').each(function() {
			console.log("saved!");
			$(this).trigger('click');
		});
	});

	// Bottone che attiva i dettagli dell'annotazione nella tabella delle modifiche
	$(document).on('click', '#modal-changes .show-ann', function() {
		var hide = '<i class="hide-ann fa fa-chevron-up"></i>';
		var parent = $(this).parent();
		parent.html(hide);
		parent.parent().nextUntil("tr.sup").show();
	});

	// Bottone che disattiva i dettagli dell'annotazione nella tabella delle modifiche
	$(document).on('click', '#modal-changes .hide-ann', function() {
		var show = '<i class="show-ann fa fa-chevron-down"></i>';
		var parent = $(this).parent();
		parent.html(show);
		parent.parent().nextUntil("tr.sup").hide();
	});

	// Conferma le modifiche ai campi della modal e le memorizza in arrayNewRes
	$(document).on('click', '#modal-details .confirm', function() {
		//Elementi comuni a tutte le modifiche
		var modalblock = $(document).find('#modal-details');
		var annNum = modalblock.find(".id").html();
		//var type = modalblock.find('.ann-type select').val();
		//modalblock.find('.ann-type').html(type);
		var type = modalblock.find('.ann-type').html();
		var label = modalblock.find('.ann-label textarea').val();
		modalblock.find('.ann-label').html(label);
		//prende il valore della label
		var newAnn = arrayNewRes[currentArticleID][annNum];
		if (type == "Autore") {
			//select
			newAnn.body.resource.id = modalblock.find('.widget select').val();
			newAnn.body.resource.label = getAuthorName(newAnn.body.resource.id);
			modalblock.find('.widget').html(newAnn.body.resource.label);
		} else if (type == "Retorica") {
			//select
			newAnn.body.literal = modalblock.find('.widget select').val();
			modalblock.find('.widget').html(getRhetoricLabel(newAnn.body.literal));
		} else if (type == "Anno di pubblicazione" || type == "DOI" || type == "URL") {
			//input
			newAnn.body.literal = modalblock.find('.widget input').val();
			modalblock.find('.widget').html(newAnn.body.literal);
		} else if (type == "Titolo" || type == "Commento") {
			//textArea
			newAnn.body.literal = modalblock.find('.widget textarea').val();
			modalblock.find('.widget').html(newAnn.body.literal);
		} else if (type == "Citazione") {
			//2 input box: label e url
			newAnn.body.resource.label = modalblock.find('.widget input').eq(0).val();
			//label della Citazione
			newURL = modalblock.find('.widget input').eq(1).val();
			newAnn.body.resource.id = newURL;
			modalblock.find('.widget').html('<a href="' + newURL + '">' + newAnn.body.resource.label + '</a>');
			// Preleva i dettagli dell'articolo citato
			var num;
			var cited_table = modalblock.find('#cited-table');
			// Titolo
			var title_cited = cited_table.find('.ann-title-cited textarea').val();
			cited_table.find('.ann-title-cited').html(title_cited);
			$.each(cited_table.find('.ann-title-cited').attr('class').split(' '), function(i, val) {
				if ($.isNumeric(val))
					num = val;
			});
			if (arrayNewResCited[currentArticleID] != undefined && num!=undefined)
				arrayNewResCited[currentArticleID][num].body.literal = title_cited;
			// Anno
			var year_cited = cited_table.find('.ann-year-cited input').val();
			cited_table.find('.ann-year-cited').html(year_cited);
			$.each(cited_table.find('.ann-year-cited').attr('class').split(' '), function(i, val) {
				if ($.isNumeric(val))
					num = val;
			});
			if (arrayNewResCited[currentArticleID] != undefined  && num!=undefined)
				arrayNewResCited[currentArticleID][num].body.literal = year_cited;
			// DOI
			var doi_cited = cited_table.find('.ann-doi-cited input').val();
			cited_table.find('.ann-doi-cited').html(doi_cited);
			$.each(cited_table.find('.ann-doi-cited').attr('class').split(' '), function(i, val) {
				if ($.isNumeric(val))
					num = val;
			});
			if (arrayNewResCited[currentArticleID] != undefined && num!=undefined)
				arrayNewResCited[currentArticleID][num].body.literal = doi_cited;
			// Autori
			var authors_cited = [];
			cited_table.find('.ann-authors-cited input,select').each(function() {
				if (getAuthorName($(this).val()) != null) {
					authors_cited.push({
						id : $(this).find('option:selected').text(),
						annotated : true
					});
				} else {
					authors_cited.push({
						id : $(this).val(),
						annotated : false
					});
				}
			});
			cited_table.find('.ann-authors-cited').empty();
			$.each(authors_cited, function(key, val) {
				cited_table.find('.ann-authors-cited').append(val['id'] + ', ');
			});
			// Tolgo la virgola e lo spazio finali
			var content = cited_table.find('.ann-authors-cited').html();
			cited_table.find('.ann-authors-cited').html(content.substr(0, content.length - 2));
			var cited_data = {
				expression : arrayNewRes[currentArticleID][annNum].body.resource.id,
				url : newURL,
				title : title_cited,
				year : year_cited,
				doi : doi_cited,
				authors_cited : authors_cited
			};
			createCitedNote(cited_data, newAnn.body.resource.label, cited_table);
		}
		newAnn.body.label = label;
		$.each(ann_types, function(key, val) {
			if (val['label'] == type) {
				newAnn['type'] = key;
			}
		});
		if (JSON.stringify(arrayNewRes[currentArticleID][annNum]) != JSON.stringify(arrayOldRes[currentArticleID][annNum])) {
			updateTable(currentArticleID, annNum, false);
		}
		$(this).removeClass("confirm");
		$(this).addClass("edit");
		$(this).html("Modifica");
		modalblock.find('.target-edit').hide();
	});

	// Apre la piccola modal di modifica del target
	$(document).on('click', '#modal-details .target-edit', function() {
		$('#modal-details').hide();
		$("#modal-target .fa").show();
		$("#modal-target").modal({
			backdrop : 'static',
			keyboard : false
		});
		$(".modal-backdrop").hide();
		var annNum = $('#modal-details').find(".id").html();
		var node = $(document).find(".highlight." + annNum);
		var classList = node.attr('class').split(/\s+/);
		var type;
		$.each(classList, function(i) {
			if (classList[i] === 'hasAuthor') {
				type = 'hasAuthor';
			} else if (classList[i] === 'hasTitle') {
				type = 'hasTitle';
			} else if (classList[i] === 'hasPublicationYear') {
				type = 'hasPublicationYear';
			} else if (classList[i] === 'hasDOI') {
				type = 'hasDOI';
			} else if (classList[i] === 'hasComment') {
				type = 'hasComment';
			} else if (classList[i] === 'denotesRhetoric') {
				type = 'denotesRhetoric';
			} else if (classList[i] === 'hasURL') {
				type = 'hasURL';
			} else if (classList[i] === 'cites') {
				type = 'cites';
			}
		});
		viewHighlight('hide', '.highlight:not(.' + annNum + ')');
	});

	// Conferma la modifica del target
	$(document).on('mousedown', '#modal-target .fa-check', function() {
		// Da annotazioniLocali.js
		var txt = "";
		txt = getText();
		console.log(txt);
		var annNum = $('#modal-details').find(".id").html();
		if (txt == "") {
			select_empty();
		} else {
			var x = new String(txt);
			var id = txt.anchorNode.parentElement.id;
			var start = $("#" + id).text().indexOf(txt);
			arrayNewRes[currentArticleID][annNum].target.start = start;
			var end = start + x.length;
			arrayNewRes[currentArticleID][annNum].target.end = end;
			var node = document.getElementById(id);
			console.log(start, end);
		}
		if (arrayOldResCited[currentArticleID] != undefined) {
			if (JSON.stringify(arrayNewRes[currentArticleID][annNum]) != JSON.stringify(arrayOldRes[currentArticleID][annNum])) {
				updateTable(currentArticleID, annNum, false);
			}
		}
		viewHighlight('show', '.highlight:not(.' + annNum + ')');
		$("#modal-target").modal('hide');
		$(".modal-backdrop").show();
		$("#modal-details").show();
	});

	// Annulla la modifica del target
	$(document).on('click', '#modal-target .fa-times', function() {
		var annNum = $('#modal-details').find(".id").html();
		viewHighlight('show', '.highlight:not(.' + annNum + ')');
		$("#modal-target").modal('hide');
		$(".modal-backdrop").show();
		$("#modal-details").show();
	});

});

function createCitedNote(cited_data, cited_article, table) {
	console.log(cited_data);
	var note,
	    num = null;
	// Titolo
	if (cited_data.title != "" && cited_data.title != null) {
		$.each(table.find('.ann-title-cited').attr('class').split(' '), function(i, val) {
			if ($.isNumeric(val))
				num = val;
		});
		note = {
			typeNote : "Titolo",
			expression : cited_data.expression,
			url : cited_data.url,
			id : "",
			start : "",
			end : "",
			val : cited_data.title,
			name : name,
			mail : mail,
			comment : "Il titolo di questo articolo è " + cited_data.title
		};
		if (num == null) {
			noteLocali.push(note);
			insertIntoTable(note, numero_note, cited_article);
		} else if (JSON.stringify(arrayNewResCited[currentArticleID][num]) != JSON.stringify(arrayOldResCited[currentArticleID][num])) {
			updateTable(currentArticleID, num, true);
		}
		numero_note = numero_note + 1;
	}
	// Anno
	if (cited_data.year != "" && cited_data.year != null) {
		$.each(table.find('.ann-year-cited').attr('class').split(' '), function(i, val) {
			if ($.isNumeric(val))
				num = val;
		});
		note = {
			typeNote : "Anno di pubblicazione",
			expression : cited_data.expression,
			url : cited_data.url,
			id : "",
			start : "",
			end : "",
			val : cited_data.year,
			name : name,
			mail : mail,
			comment : "Questo articolo è stato pubblicato nel " + cited_data.year
		};
		if (num == null) {
			noteLocali.push(note);
			insertIntoTable(note, numero_note, cited_article);
		} else if (JSON.stringify(arrayNewResCited[currentArticleID][num]) != JSON.stringify(arrayOldResCited[currentArticleID][num])) {
			updateTable(currentArticleID, num, true);
		}
		numero_note = numero_note + 1;
	}
	// DOI
	if (cited_data.doi != "" && cited_data.doi != null) {
		$.each(table.find('.ann-doi-cited').attr('class').split(' '), function(i, val) {
			if ($.isNumeric(val))
				num = val;
		});
		note = {
			typeNote : "DOI",
			expression : cited_data.expression,
			url : cited_data.url,
			id : "",
			start : "",
			end : "",
			val : cited_data.doi,
			name : name,
			mail : mail,
			comment : "Il doi di questo articolo " + cited_data.doi
		};
		if (num == null) {
			noteLocali.push(note);
			insertIntoTable(note, numero_note, cited_article);
		} else if (JSON.stringify(arrayNewResCited[currentArticleID][num]) != JSON.stringify(arrayOldResCited[currentArticleID][num])) {
			updateTable(currentArticleID, num, true);
		}
		numero_note = numero_note + 1;
	}
	// Autori
	$.each(cited_data.authors_cited, function(index, item) {
		if (item.id != "" && item.id != null) {
			note = {
				typeNote : "Autore",
				expression : cited_data.expression,
				url : cited_data.url,
				id : "",
				start : "",
				end : "",
				val : item.id,
				name : name,
				mail : mail,
				comment : "Un autore di questo articolo è " + item.id
			};
			noteLocali.push(note);
			insertIntoTable(note, numero_note, cited_article);
			numero_note = numero_note + 1;
			loadList();
		}
	});
}

// Presa da http://codepen.io/AlexBezuska/pen/kCwvJ, modificata
var sortSelect = function(select, attr, order) {
	if (attr == 'text') {
		if (order == 'asc') {
			select.html(select.children('option').sort(function(x, y) {
				return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
			}));
		}// end asc
		else if (order == 'desc') {
			select.html(select.children('option').sort(function(y, x) {
				return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
			}));
		}
		// end desc
		select.get(0).selectedIndex = 0;
	}
};

function getModal(annID) {
	if (modeVE == 'Viewer')
		$('#modal-details .edit').hide();
	else
		$('#modal-details .edit').show();
	$("#modal-details #cited-table").hide();
	$("#modal-details .id").html(annID);
	$("#modal-details .id").hide();
	$("#modal-details td:nth-child(2)").empty();
	$("#modal-details .ann-label").html(arrayNewRes[currentArticleID][annID]['body']['label']);
	$("#modal-details .ann-type").html(ann_types[arrayNewRes[currentArticleID][annID]['type']]['label']);
	if (arrayNewRes[currentArticleID][annID]['type'] == 'cites') {
		$("#modal-details .ann-expr-cited").html(arrayNewRes[currentArticleID][annID]['body']['resource']['id']);
	}
	var obj = $("#modal-details th").eq(2);
	var widget = $("#modal-details").find(".widget");
	var type = ann_types[arrayNewRes[currentArticleID][annID]['type']]['label'];
	if (type == 'Autore') {
		var name = arrayNewRes[currentArticleID][annID]['body']['resource']['label'];
		widget.html(name);
	} else if (type == 'Anno di pubblicazione' || type == 'Titolo' || type == 'DOI' || type == 'URL' || type == 'Commento') {
		widget.html(arrayNewRes[currentArticleID][annID]['body']['literal']);
	} else if (type == 'Retorica') {
		widget.html(getRhetoricLabel(arrayNewRes[currentArticleID][annID].body.literal));
	} else if (type == 'Citazione') {
		widget.html('<a href="' + arrayNewRes[currentArticleID][annID]['body']['resource']['id'] + '">' + arrayNewRes[currentArticleID][annID]['body']['resource']['label'] + '</a');
		var expr = $("#modal-details .ann-expr-cited").html();
		cited_table = $("#modal-details #cited-table");
		cited_table.find('.ann-title-cited').empty();
		cited_table.find('.ann-title-cited').attr('class', 'ann-title-cited');
		cited_table.find('.ann-year-cited').empty();
		cited_table.find('.ann-year-cited').attr('class', 'ann-year-cited');
		cited_table.find('.ann-doi-cited').empty();
		cited_table.find('.ann-doi-cited').attr('class', 'ann-doi-cited');
		cited_table.find('.ann-authors-cited').empty();
		cited_table.find('.ann-authors-cited').attr('class', 'ann-authors-cited');
		if (arrayNewResCited[currentArticleID] != undefined) {
			$.each(arrayNewResCited[currentArticleID], function(i, val) {
				if (val.body.subject == expr) {
					if (val.label == 'Titolo') {
						cited_table.find('.ann-title-cited').html(val.body.literal);
						cited_table.find('.ann-title-cited').addClass(i.toString());
					} else if (val.label == 'Anno di pubblicazione') {
						cited_table.find('.ann-year-cited').html(val.body.literal);
						cited_table.find('.ann-year-cited').addClass(i.toString());
					} else if (val.label == 'DOI') {
						cited_table.find('.ann-doi-cited').html(val.body.literal);
						cited_table.find('.ann-doi-cited').addClass(i.toString());
					} else if (val.label == 'Autore') {
						cited_table.find('.ann-authors-cited').append(val.body.resource.label + ', ');
						cited_table.find('.ann-authors-cited').addClass(i.toString());
					}
				}
			});
		}
		// Tolgo la virgola e lo spazio finali
		var content = cited_table.find('.ann-authors-cited').html();
		cited_table.find('.ann-authors-cited').html(content.substr(0, content.length - 2));
		cited_table.show();
	}
	obj.html(type);
	//$("#modal-details th:contains('Posizione') + td").html(newRes[i]['target']['source'] + '#' + newRes[i]['target']['selector'] + '-' + newRes[i]['target']['start'] + '-' + newRes[i]['target']['end']);
	$("#modal-details .provenance").html(arrayNewRes[currentArticleID][annID]['provenance']['author']['name'] + ", " + convertDate(arrayNewRes[currentArticleID][annID]['provenance']['time'], 'day') + " alle " + convertDate(arrayNewRes[currentArticleID][annID]['provenance']['time'], 'hour'));
	var btn = $("#modal-details .confirm");
	$("#modal-details").find('.tr_target').remove();
	btn.removeClass("confirm");
	btn.addClass("edit");
	btn.html("Modifica");
}

function getWidget(modalblock, type) {
	var widget = modalblock.find('.widget');
	var val = widget.html();
	var prev_type = widget.prev().html();
	var prev_val = widget.html();
	widget.prev().html(type);
	if (prev_type != type) {
		val = "";
		// Elimina html che diverrebbe visibile
	}
	if (type == 'Autore') {
		// Instance widget
		widget.html('<select class="form-control"></select>');
		var select = widget.find("select");
		$.each(loadedAuthors, function(i) {
			select.append('<option value="' + loadedAuthors[i].url + '">' + loadedAuthors[i].name + '</option>');
		});
		sortSelect(select, 'text', 'asc');
		select.children('option').each(function() {
			if ($(this).html() == val) {
				$(this).attr('selected', 'selected');
			}
		});
	} else if (type == 'Anno di pubblicazione') {
		// Date (year) widget
		widget.html('<input class="form-control" type="number" min="1990" max="2016" value="' + val + '"> (Inserire un valore tra 1990 e 2015 compresi)');
	} else if (type == 'Titolo' || type == 'Commento') {
		// Long text widget
		widget.html('<textarea class="form-control" rows="2" cols="50">' + val + '</textarea>');
	} else if (type == 'DOI') {
		// Short text widget
		widget.html('<input class="form-control" type="text" value="' + val + '">');
	} else if (type == 'URL') {
		// URL widget
		widget.html('<input class="form-control" type="url" value="' + val + '">');
	} else if (type == 'Retorica') {
		// Choice widget
		widget.html('<select class="form-control"></select>');
		var select = widget.find("select");
		$.each(ann_types['denotesRhetoric']['type'], function(i) {
			select.append('<option value="' + ann_types['denotesRhetoric']['type'][i].uri + '">' + ann_types['denotesRhetoric']['type'][i].label + '</option>');
		});
	} else if (type == 'Citazione') {
		// Citation widget
		// Devo parsare una stringa html
		var parser = new DOMParser();
		var doc = parser.parseFromString(val, "text/xml");
		// xml perché non inserisce l'header html
		var href = doc.firstChild.getAttribute('href');
		var text = doc.firstChild.textContent;
		widget.html('Label: <input type="text" class="text form-control"" value="' + text + '"><br/>URL: <input type="url" class="url form-control" value="' + href + '">');
		// Campi per i dettagli dell'articolo citato
		val = modalblock.find('.ann-title-cited').html();
		modalblock.find('.ann-title-cited').html('<textarea class="form-control" rows="2" cols="50">' + val + '</textarea>');
		val = modalblock.find('.ann-year-cited').html();
		modalblock.find('.ann-year-cited').html('<input class="form-control" type="number" min="1990" max="2016" value="' + val + '"> (Inserire un valore tra 1990 e 2015 compresi)');
		val = modalblock.find('.ann-doi-cited').html();
		modalblock.find('.ann-doi-cited').html('<input class="form-control" type="text" value="' + val + '">');
		val = modalblock.find('.ann-authors-cited').html().split(', ');
		console.log(val);
		modalblock.find('.ann-authors-cited').empty();
		$.each(val, function(i, item) {
			var del_author = '<button title="Rimuovi autore" type="button" class="btn btn-default del-author"><i class="fa fa-times fa-2x"></i></button>';
			modalblock.find('.ann-authors-cited').append('<select class="form-control"></select>' + del_author);
			select = modalblock.find('.ann-authors-cited').find("select").last();
			$.each(loadedAuthors, function(j) {
				select.append('<option value="' + loadedAuthors[j].url + '">' + loadedAuthors[j].name + '</option>');
			});
			sortSelect(select, 'text', 'asc');
			select.children('option').each(function() {
				if ($(this).html() == item) {
					$(this).attr('selected', 'selected');
				}
			});
		});
		addAuthorButtons(modalblock.find('.ann-authors-cited'));
	}
}

// Crea una lista da cui scegliere un autore, con opzione per aggiungerne altri
function addAuthorButtons(field) {
	var add_author = '<button title="Aggiungi autore" type="button" class="btn btn-default add-author"><i class="fa fa-user fa-2x"></i></button>';
	var add_new_author = '<button type="Crea autore" class="btn btn-default add-new-author"><i class="fa fa-user-plus fa-2x"></i></button>';
	field.append('<div class="add-author-buttons">' + add_author + add_new_author + '</div>');
}

// Aggiunge un autore dalla lista presente
$('#modal-details').on('click', '.add-author', function(){
	var del_author = '<button title="Rimuovi autore" type="button" class="btn btn-default del-author"><i class="fa fa-times fa-2x"></i></button>';
	$('<select class="form-control"></select>'+del_author).insertBefore($(this).parent());
	var select = $(this).parents().eq(1).find('select');
	$.each(loadedAuthors, function(i) {
		select.append('<option value="' + loadedAuthors[i].url + '">' + loadedAuthors[i].name + '</option>');
	});
	sortSelect(select, 'text', 'asc');
});

// Predispone un textbox per aggiungere un nuovo autore non presente nella lista
$('#modal-details').on('click', '.add-new-author', function(){
	var del_author = '<button title="Rimuovi autore" type="button" class="btn btn-default del-author"><i class="fa fa-times fa-2x"></i></button>';
	$('<input class="form-control" type="text" value="">'+del_author).insertBefore($(this).parent());
});

// Rimuove un elemento inserito per aggiungere un autore
$('#modal-details').on('click', '.del-author', function(){
	$(this).prev().remove();
	$(this).remove();
});

// Converte il formato della data di creazione
function convertDate(date, what) {
	var weekdays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
	var months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
	var d = new Date(date);
	if (what == 'day')
		return weekdays[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
	else if (what == 'hour')
		return eval(d.getHours()-1) + ':' + d.getMinutes();
}

// Apre la tabella delle modifiche locali
$('#doc_info').click(function() {
	$('#modal-changes').modal();
});

function getAuthorName(author) {
	var name = null;
	$.each(loadedAuthors, function(j) {
		if (loadedAuthors[j].url == author) {
			name = loadedAuthors[j].name;
		}
	});
	return name;
}

function getRhetoricLabel(rhetoricUri) {
	var name;
	$.each(ann_types['denotesRhetoric']['type'], function(key, object) {
		if (object.uri == rhetoricUri) {
			name = object.label;
		}
	});
	return name;
}
