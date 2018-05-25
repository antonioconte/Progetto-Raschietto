$(document).ready(function() {
	$(document).on('click', 'span.highlight', function(e) {

		if ($(this).parents("span.highlight").size() > 0){
			manageViewing($(this), e, true);
		} else {
			manageViewing($(this), null, false);
		}


	});

	$(document).on('click', '#choosed', function() {
		var n = $(this).attr('class');
		var autore = $(this).attr('autore');
		var elem = $(document).find('.highlight.'+autore+'.'+n);
		manageViewing(elem, null, false);
	});
});

  function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function manageViewing(elem, event, mode) {
	var modalnote = $('#modal-note');
	if (mode) {// Se ci sono più annotazioni sul frammento cliccato
		modalnote.find('.modal-title').html('Annotazioni in questo frammento');
		var table = '<table></table>';
		modalnote.find(".modal-body").html(table);
		table = modalnote.find(".modal-body table");
		table.append('<tr><th>Gruppo</th><th>Tipo Annotazione</th></tr>');
		var classList = elem.attr('class').split(/\s+/);
		var tipo;
		var n;
		$.each(classList, function(index, item) {
			if ($.isNumeric(item)) {
				n = item;
			} else if (item!='highlight' && item.indexOf('ltw') < 0){
				tipo = item;
			}
		});
		table.append('<tr><td><a id="choosed" autore="'+elem.attr("autore") +'" class="' + n + '">' + getGroupName(elem.attr("autore")) + '</a></td><td>'+tipo+'</td></tr>');
		elem.parents("span.highlight").each(function() {
			classList = $(this).attr('class').split(/\s+/);
			$.each(classList, function(index, item) {
				if ($.isNumeric(item)) {
					n = item;
				} else if (item!='highlight' && item.indexOf('ltw') < 0){
					tipo = item;
				}
			});
			table.append('<tr><td><a id="choosed"  autore="'+$(this).attr("autore") +'" class="' + n + '">' + getGroupName($(this).attr("autore")) + '</a></td><td>'+tipo+'</td></tr>');
		});
		var close = '<button type="button" class="btn btn-default" data-dismiss="modal">	Close </button>' ;

		modalnote.find(".modal-footer").html(close);

		event.stopPropagation();
	} else {

		var type = elem.attr('class');
		var cancel = "";
		var close = '<button type="button" class="btn btn-default" data-dismiss="modal">	Close </button>' ;
		if(elem.attr("value") == 1){
			var local = " [ Nota in Locale ]";
			var no = type.split(" ");
			var n = no[2];
		  cancel = '<button type="button" onclick="deleteLocalNote(' + n + ')" class="btn btn-default" data-dismiss="modal">	Cancella </button>';
	}
	else  var local = "";
		modalnote.find('.modal-title').html('Dettagli annotazione ' + local);
		modalnote.find('.modal-body').html('<p><label>Titolo: </label> <span id="titolo-nota"></span></p><p><label>Contenuto: </label> <span id="contenuto-nota"></span></p><p><label>Autore: </label> <span id="autore-nota"></span></p><p><label>Ora: </label> <span id="time-nota"></span></p>');
		modalnote.find("#titolo-nota").html(elem.attr("title"));
		modalnote.find("#contenuto-nota").html(elem.attr("data-content"));
		modalnote.find("#autore-nota").html(getGroupName(elem.attr("autore")));
		modalnote.find("#time-nota").html(elem.attr("tempo"));
		modalnote.find(".modal-footer").html(cancel+close);



	}
	modalnote.modal();
}

function getGroupName(id){
	var nome = null;
	if (id == 'ltw1515'){
		nome = 'Script and Furious';
	} else {
		$.each(loadedGroups, function(j) {
		if (loadedGroups[j].grafo == id) {
			nome = loadedGroups[j].nome;
		}
	});
	}
	return nome;
}
