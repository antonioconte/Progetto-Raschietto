$(document).ready(function() {
	load_list_article();
	loadList();
	$(".title_scroll").hide();
	$(".title_scroll").hide();
	$("#doc_info").hide();
	$("#createNote").hide();

 	$("#rescrape").click(function(){
		var u = $(this).val();
		graph(u, null)
	})

	$(".alert").hide();
	$("#otherPage").scroll(function(){
		if($(this).scrollTop()> 400) $(".title_scroll").show(1000);
		else $(".title_scroll").hide(1000);
	});
	$("#checkOurNote").click(function(){
		if($(this).val() == 1){
			//disattiva
			$(".highlight.ltw1515").removeClass("highlight");
			$(this).val(0);
		}
		else{
			//attiva
			$(".ltw1515").addClass("highlight");
			$(this).val(1);
		}
	});

	$("#search_url").click(function() {
		var url = $("#searchbar").val();
	if(url != ""){
			if (url.indexOf("dlib.org") +1 || url.indexOf("rivista-statistica.unibo.it")+1   || url.indexOf("montesquieu.unibo.it" )+1 || url.indexOf("intreccidarte.unibo.it")+1) {
				$("#articolo").show();

		    	graph(url, null)
			}
		else {
				$("#extra").show();
			$("#articolo").hide();
			$("#extra").html('<object data="'+url+'"  width="100%" height="750px"></object>');
		}
	}
	});

});

function getTitle(){
	for(var i = 0; i < numero_note; i++){
		if(arrayNewRes[id][i]["label"] == "Titolo"){
			return arrayNewRes[id][i]["body"]["literal"];
		}
	}
}

/*Sceglie quale scraper usare a seconda dell'url*/
function graph(url, id) {
	//alert(url)
	$("#rescrape").val(url)
	$(".disabled").removeClass("disabled");
	alert_scraping();
	$(".tab-content").hide();
	$.ajax({
		type : "GET",
		url : "./php/loaders/loadexternal.php?url=" + url,
		success : function(d) {
		//	alert('carico dom articolo')
			$(".alert-gruppi").show(500);
			$("div#otherPage").html(d[0]);
			load_list_group(url);
			currentArticle = url;
			currentArticleID = id;
			$.ajax({
				method : "GET",
				url : "./php/loaders/load.php?url=" + url,
				dataType : 'json',
				success : function(res) {
					//	alert('carico note')
					$(".modal-group-note").html("");
			//		$(".fakeloader").fadeOut();
					// Duplico gli oggetti rendendoli autonomi l'uno dall'altro (deep mode)
					$("#annotations").html("");
					arrayOldRes[id] = $.extend(true, {}, res);
					arrayNewRes[id] = $.extend(true, {}, res);
					currentExpression = arrayNewRes[currentArticleID][0]['body']['subject'];
					otherNotes[currentArticleID] = new Array();
					/*Start Dlib*/
					if(url.indexOf("dlib")>0){
						numero_note = res.length;
						$("#Numero_note.numero_note").html(res.length);

						for ( i = 0; i < res.length; i++) {
							if(arrayNewRes[id][i]['label'] == "Titolo"){
								$(".title_scroll").html(arrayNewRes[id][i]['body']['literal']);
								titolo = arrayNewRes[id][i]['body']['literal'];
							}
							var item = '<div class="well well-sm"><div class="annot" id="' + eval(i + 1) + '"><i href="#" onclick="deleteFromStore(\''+arrayNewRes[id][i]['label']+'\',\''+currentArticle+'\',\''+arrayNewRes[id][i]['target']['id']+'\','+arrayNewRes[id][i]['target']['start']+','+arrayNewRes[id][i]['target']['end']+','+i+')" class="fa fa fa-times fa-lg">&nbsp;</i><i href="#" class="openblock fa fa-plus-circle fa-lg"></i> ' + eval(i + 1) + '. [' + res[i]['label'] + '] ' + res[i]['body']['label'] +'</div></div>';
							$("#annotations").append(item);
							createHighlight(arrayNewRes[id][i]['target']['id'], arrayNewRes[id][i]['target']['start'], arrayNewRes[id][i]['target']['end'], arrayNewRes[id][i], i, arrayNewRes[id][i]['provenance']['time']);
							$("#Numero_note.numero_note").html(i+1);
						}
					}
					/*End Dlib */

					/*Altro CASO*/
					else{
						var notesother = 0;
					  	for ( i = 0; i < res.length; i++) {
							if(res[i]['target']['id'] != ""){
								var node = document.getElementById(res[i]['target']['id']);
								var item;

								if(res[i]['label'] == "Autore") item = '<div class="well well-sm"><div class="annot" id="' + eval(i + 1) + '"><i href="#"  onclick="deleteFromStore(\''+arrayNewRes[id][i]['label']+'\',\''+currentArticle+'\',\''+arrayNewRes[id][i]['target']['id']+'\','+arrayNewRes[id][i]['target']['start']+','+arrayNewRes[id][i]['target']['end']+')" class="fa fa fa-times fa-lg"></i>&nbsp;<i href="#" class="openblock fa fa-plus-circle fa-lg"></i> ' + eval(i + 1) + '. [' + res[i]['label'] + '] ' + res[i]['body']['label'] +'</div></div>';
								else{
									if(arrayNewRes[id][i]['label'] == "Titolo"){
										titolo = arrayNewRes[id][i]['body']['literal'];
										$(".title_scroll").html(arrayNewRes[id][i]['body']['literal']);
									}
									item = '<div class="well well-sm"><div class="annot" id="' + eval(i + 1) + '"><i href="#"  onclick="deleteFromStore(\''+arrayNewRes[id][i]['label']+'\',\''+currentArticle+'\',\''+arrayNewRes[id][i]['target']['id']+'\','+arrayNewRes[id][i]['target']['start']+','+arrayNewRes[id][i]['target']['end']+','+(i+1)+')" class="fa fa fa-times fa-lg"></i>&nbsp;<i href="#" class="openblock fa fa-plus-circle fa-lg"></i> ' + eval(i + 1) + '. [' + res[i]['label'] + '] ' + res[i]['body']['label'] +'</div></div>';
								}
								notesother++;

								insertRange(node,res[i]['target']['start'],res[i]['target']['end'],eval(i+1),res[i]['type'],eval(i+1) + ". " + res[i]['label'], res[i]['body']["label"], res[i]['provenance']['time']);
								$("#annotations").append(item);
								$("#Numero_note.numero_note").html(notesother);
								//	$(".fakeloader").fadeOut();
							}
						}
					}
					if(noteLocali.length >0 ) loadLocalNotes();
	$(".fakeloader").fadeOut();

					/*FINE ALTRO CASO */
					// In mode Viewer i pulsanti per mostra i widget non devono comparire
					if (modeVE == "Viewer"){
						$(document).find(".fa-times").hide();
						//$(document).find(".edit").hide();
					}

				},
				error : function() {
					console.log("Error in Load.php");
				}
			});
			
					// Carico le annotazioni sugli articoli citati
			$.ajax({
				method : "GET",
				url : './php/loaders/load_cited.php?url=' + currentArticle,
				dataType : 'json',
				success : function(d) {
					arrayOldResCited[id] = $.extend(true, [], d);
					arrayNewResCited[id] = $.extend(true, [], d);
				},
				error : function(e) {
					if (e.readyState != 4) {
						console.log(e);
						alert("Errore caricamento annotazioni sull'articolo citato");
					}
				}
			});
			
			
		},
		error : function() {
		//	alert("Error Loading Page - " + url);
		}
	});
	
	

	$("#articolo").show();
	$("#extra").hide();
	// $(".fakeloader").fadeOut();
}

function load_list_group(url){
	//alert('aaaa')
	$.ajax({
		type: "GET",
		url: "./php/loaders/group_list.php?url="+url,
		success: function(d){
			$("#numeroGruppi").html(d.length)
			$(".lista-gruppi").empty();
			var i;
			for(i = 0; i< d.length; i++){
				loadedGroups = $.extend(true, [], d);
				$(".lista-gruppi").append("<div value='"+d[i].grafo+"' class='well groupMemberList "+ d[i].grafo +"  well-sm'>"+d[i].nome+"&nbsp;&nbsp;  [ " +d[i].grafo+" ] <i gruppo='"+d[i].grafo+"' class='open-modal-block fa fa-plus-square'></i> <input class='checkGruppo' check=1 value='"+d[i].grafo+"' style='float: right;' type='checkbox' checked></div>")
				load_other_note(url,d[i]['grafo']);
			}
			/*carico note altri gruppi*/
			//	$(document).find("i.open-modal-block").hide();
			$(".alert-gruppi").hide(500);
		},
		error: function(){
			$(".alert-gruppi").hide(500);

		}
	});
}

function load_list_article() {
	
	var i;
	$.ajax({
		type : "GET",
		url : "./php/loaders/articoli.php",
		success : function(d) {
			console.log(d)
			$("#list").html("");
			for ( i = 0; i < d.length; i++) {
				if (i == 0){
				//	alert('Carico il primo articolo')
					while (d[i].url.indexOf('.html')<0) i++;
					graph(d[i].url, 1);
				}
				//carica il primo articolo della lista
				//$("#modal-docs .modal-body").append("<tr><td>"+ eval(i + 1)+"</td><td><span class='url' style='display:none;'>" + d[i].url + "</span><a href='#' onclick='graph(\"" + d[i].url + "\", " + eval(i + 1) + ")' > " + d[i].title + "</a></td><td><i title='Ricarica annotazioni' class='fa fa-cogs re-scrape'></i></td><td><i title='Elimina' class='fa fa-trash delete-doc'></i></td></tr>");
				loadedArticles.push(d[i].title);
			}
		},
		error : function() {
			alert("errore nel caricamento");
		//	$(".fakeloader").fadeOut();
		}
	});
}

function loadLocalNotes(){
		var i;
		for(i=0; i<noteLocali.length; i++){
				if(noteLocali[i].url == currentArticle){
					var node = document.getElementById(noteLocali[i].id);
					insertRange(node, noteLocali[i].start, noteLocali[i].end, noteLocali[i].num, noteLocali[i].typeCSS + " local", noteLocali[i].typeNote, noteLocali[i].comment,noteLocali[i].date);
					}
			}
	}

NodeList.prototype.indexOf = function(n) {
	var i = -1;
	while (this.item(i) !== n)
	i++;
	return i;
};


// Carica la lista degli articoli e degli autori
function loadList() {
	$.ajax({
		method : "GET",
		url : "./php/loaders/loadList.php",
		success : function(result) {
				for ( i = 0; i < result['authors'].length; i++) {
				loadedAuthors[i] = {
					"name" : result['authors'][i]['name'],
					"url" : result['authors'][i]['url']
				};
			}

		},
		error : function() {
			//alert("Errore caricamento lista!");
		}
	});
}

//Cancella la nota dal triplestore
function deleteFromStore(tipo, url, id, start, end, nclass){
	var n = {
		tipo: tipo,
		url: url,
		id: id,
		start: start,
		end: end
	}

	$.ajax({
    type: "POST",
    contentType: "application/json",
    url: "./php/note_editors/delete.php",
    data: JSON.stringify(n),
    success: function(){
      alert_delete_success();
    },
    error: function(){
    }
  });
	$(".highlight."+ nclass).removeClass("highlight");
}

//Cancella dall'html la nota
	$(document).on('click', '.fa-times', function() {
		var parent = $(this).parent().attr("id");
		$("#"+parent).parent().remove();
	});


function load_other_note(url, gruppo){
	$.ajax({
		type : "GET",
		url : "./php/loaders/other_groups_notes.php?url=" + url + "&gruppo=" + gruppo,
		success : function(res) {
			otherNotes[currentArticleID][gruppo]=$.extend(true, {}, res);
			$(".groupMemberList." + gruppo + " > span.label-info").empty();
			 var templateModal = '<div class="modal fade modal-' + gruppo + '">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + '<h4 class="modal-title-other-note">' + gruppo + '</h4></div>' + '<div class="modal-body modal-body-' + gruppo + '"></div><div class="modal-footer">' + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>' + '</div></div></div>';
			 $(".modal-group-note").append(templateModal);
			// var newbox ='<ul class="list-group"><li class="list-group-item collapsed" data-toggle="collapse" data-target="#open_note"><span id="Numero_note" class="badge bvisit numero_note"></span><label>'+gruppo+'</label></li><div id="open_note" class="list-group collapse"><div id="annotations" class="panel panel-default note_correnti">ciao</div></div></ul>';
			// $("#sinistra > div").append(newbox);
			for ( i = 0; i < res.length; i++) {
				var node = document.getElementById(res[i]['target']['id']);
				try {
					if(res[i].type != null){
					var item = '<div class="well well-sm"><div class="annot"><i href="#" class="fa fa-arrow-right fa-lg"></i> ' + eval(i + 1) + '. [' + res[i]['label'] + '] ' + res[i]['body']['label'] + '</div></div>';
					$(".modal-body-" + gruppo).append(item);
					insertRangeOther(node, res[i].target.start, res[i].target.end, gruppo, i, res[i].type, res[i].label, res[i].body.label, res[i]['provenance']['time']);
				}
				} catch(e) {
					break;
				}
			}
			$(".alert-info").hide("500");
		},
		error : function(e) {
			//alert("errore con il gruppo " + gruppo);
			console.log(e);
		}
	});
}




function insertRangeOther(node, start, end, gruppo, n, type, title, content, time) {
	if (type==null) return;

	//se l'end è maggiore del numero effettivo dei caratteri del paragrafo imposto limite
	var l = $("#" + node.id).text().length;
	if (end > l)
		end = l;

	var r = document.createRange();
	var nodeStart,
	    nodeEnd,
	    parentStart,
	    parentEnd;
	var splittedStart = false,
	    splittedEnd = false;
	// La prima iterata è per splittare i nodi. Siccome poi cambia il DOM, per
	// inserire il range bisogna ricalcolare i nodi testo
	for (var iter = 0; iter < 2; iter++) {
		var leaves = [];
		leafArray(node, leaves);
		// Prima iterata
		var lengthCountStart = 0,
		    lengthCountEnd = 0;
		var i = 0;
		do {
			nodeStart = leaves[i];
			lengthCountStart += leaves[i].length;
			i++;
		} while (lengthCountStart < start);
		lengthCountEnd = lengthCountStart;
		nodeEnd = nodeStart;
		while (lengthCountEnd < end) {
			nodeEnd = leaves[i];
			lengthCountEnd += leaves[i].length;
			i++;
		}
		//console.log(leaves);
		if (iter == 0) {
			// Prima iterata
			if (nodeStart.parentNode != node) {
				var parentStart = nodeStart.parentNode;
				while (parentStart.parentNode != node) {
					parentStart = parentStart.parentNode;
				}
				splitNode(nodeStart, start - lengthCountStart + nodeStart.length, parentStart);
				splittedStart = true;
			}
			if (nodeEnd.parentNode != node) {
				var parentEnd = nodeEnd.parentNode;
				while (parentEnd.parentNode != node) {
					parentEnd = parentEnd.parentNode;
				}
				splitNode(nodeEnd, end - lengthCountEnd + nodeEnd.length, parentEnd);
				splittedEnd = true;
			}
		} else {
			// Seconda iterata
			//console.log(nodeStart);
			//console.log(nodeEnd);
			if (!splittedStart) {
				r.setStart(nodeStart, start - lengthCountStart + nodeStart.length);
			} else {
				var parentStart = nodeStart.parentNode;
				while (parentStart.parentNode != node) {
					parentStart = parentStart.parentNode;
				}
				r.setStartAfter(parentStart);
			}
			if (!splittedEnd) {
				r.setEnd(nodeEnd, end - lengthCountEnd + nodeEnd.length);
			} else {
				var parentEnd = nodeEnd.parentNode;
				while (parentEnd.parentNode != node) {
					parentEnd = parentEnd.parentNode;
				}
				r.setEndAfter(parentEnd);
			}
		}
	}
	var span = document.createElement('span');
	span.setAttribute('class', 'highlight ' + gruppo +' '+n+ ' ' + type);
	span.setAttribute('data-toggle', 'popover');
	span.setAttribute('autore', gruppo);
	span.setAttribute('tempo', time);
	span.setAttribute('title', title);
	span.setAttribute('data-content', content);
	r.surroundContents(span);

	// $(document).find('.highlight[data-toggle="popover"]').popover({
	// 	animation : true,
	// 	trigger : "hover",
	// 	placement : "top"
	// });
}



function insertRangeCites(node, start, end, n, type, title, content, time,  titoloCit, annoCit, DoiCit) {
	//se l'end è maggiore del numero effettivo dei caratteri del paragrafo imposto limite
	var l = $("#" + node.id).text().length;
	if (end > l)
		end = l;

	var r = document.createRange();
	var nodeStart,
	    nodeEnd,
	    parentStart,
	    parentEnd;
	var splittedStart = false,
	    splittedEnd = false;
	// La prima iterata è per splittare i nodi. Siccome poi cambia il DOM, per
	// inserire il range bisogna ricalcolare i nodi testo
	for (var iter = 0; iter < 2; iter++) {
		var leaves = [];
		leafArray(node, leaves);
		// Prima iterata
		var lengthCountStart = 0,
		    lengthCountEnd = 0;
		var i = 0;
		do {
			nodeStart = leaves[i];
			lengthCountStart += leaves[i].length;
			i++;
		} while (lengthCountStart < start);
		lengthCountEnd = lengthCountStart;
		nodeEnd = nodeStart;
		while (lengthCountEnd < end) {
			nodeEnd = leaves[i];
			lengthCountEnd += leaves[i].length;
			i++;
		}
		//console.log(leaves);
		if (iter == 0) {
			// Prima iterata
			if (nodeStart.parentNode != node) {
				var parentStart = nodeStart.parentNode;
				while (parentStart.parentNode != node) {
					parentStart = parentStart.parentNode;
				}
				splitNode(nodeStart, start - lengthCountStart + nodeStart.length, parentStart);
				splittedStart = true;
			}
			if (nodeEnd.parentNode != node) {
				var parentEnd = nodeEnd.parentNode;
				while (parentEnd.parentNode != node) {
					parentEnd = parentEnd.parentNode;
				}
				splitNode(nodeEnd, end - lengthCountEnd + nodeEnd.length, parentEnd);
				splittedEnd = true;
			}
		} else {
			// Seconda iterata
			//console.log(nodeStart);
			//console.log(nodeEnd);
			if (!splittedStart) {
				r.setStart(nodeStart, start - lengthCountStart + nodeStart.length);
			} else {
				var parentStart = nodeStart.parentNode;
				while (parentStart.parentNode != node) {
					parentStart = parentStart.parentNode;
				}
				r.setStartAfter(parentStart);
			}
			if (!splittedEnd) {
				r.setEnd(nodeEnd, end - lengthCountEnd + nodeEnd.length);
			} else {
				var parentEnd = nodeEnd.parentNode;
				while (parentEnd.parentNode != node) {
					parentEnd = parentEnd.parentNode;
				}
				r.setEndAfter(parentEnd);
			}
		}
	}
	var span = document.createElement('span');
	span.setAttribute('class', 'highlight  ltw1515 ' +n+ ' ' + type);
	span.setAttribute('data-toggle', 'popover');
	span.setAttribute('autore', 'ltw1515');

	if(authorforCites.length > 0 &authorforCites[1] != "") {
			var templateAutoriCitati = '<div>';
			for(x = 0;  x<authorforCites.length; x++){
					templateAutoriCitati = templateAutoriCitati + '<li>' + authorforCites[x] + '</li>';
			}
			templateAutoriCitati =templateAutoriCitati +  '</div>';
		  span.setAttribute('autori-cit', templateAutoriCitati)
			authorforCites = [];

		}

	if(titoloCit != "") span.setAttribute('title', titoloCit);
	if(DoiCit != "") span.setAttribute('doi-cit', DoiCit);
	if(annoCit != "") span.setAttribute('anno-cit', annoCit);
	span.setAttribute('tempo', time);
	span.setAttribute('data-content', content);
	r.surroundContents(span);


}
