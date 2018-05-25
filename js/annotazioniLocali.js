$(document).ready(function() {
	$("#createNote").click(function() {
		range();
	});
});

$(document).on('click', '#addauthorforcites', function(){
		$('.listAddAuthor').append("<input class='form-control newAuthor' type=text placeholder='Autore'><br>");
	})

var id,
    txt,
    start,
    end,
    node,
    val,
    comment;

function getText() {
	var txt = "";
	if (window.getSelection) {
		txt = window.getSelection();
	} else if (document.getSelection) {
		txt = document.getSelection();
	} else if (document.selection) {
		txt = document.selection.createRange();
	}
	return txt;
}

function range() {
	txt = getText();
	console.log(txt);
	if (txt == "") {
		select_empty();
		return;
	}
	var x = new String(txt);

	var nod = txt.anchorNode.parentElement;
	id = nod.id;
	/*Nel caso di annotazione sovrapposta */
	if(nod.id == "")  console.log("vuoto");
	while(nod.id == ""){
		nod= nod.parentElement;
		id = nod.id;
	}
	if(id != "") console.log("id trovato: " + id);

	//calcola start e end tramite la posizione della prima occorrenza
	start = $("#" + id).text().indexOf(txt);
	end = start + x.length;
	node = document.getElementById(id);
	console.log(start, end);
	/*Pulizie di primavera */
	$(".typeNote").empty();
	document.getElementById("selectTypeNote").value = "";
	$("#labelCreaNota").empty();
	/*************************/

	$("#modal-create-note").modal();
}

function selectType() {
	label = $("#labelCreaNota").val();
	typeNote = $("#selectTypeNote").val();
	if (typeNote == "") {
		$(".typeNote").empty();
		$("#labelCreaNota").empty();
		return;
	}
	var tmp = "<label class='col-lg-2 control-label'>#tipo#</label>"
	var j = tmp.replace("#tipo#", typeNote);
	$(".typeNote").html(j);
	if (typeNote == "Autore")
		getAuthor(currentArticleID);
	if (typeNote == "Anno di pubblicazione")
		getYear();
	if (typeNote == "Titolo")
		getTitle();
	if (typeNote == "DOI")
		getDOI();
	if (typeNote == "URL")
		getURL();
	if (typeNote == "Retorica")
		getRethoric();
	if (typeNote == "Commento")
		getComment();
	if (typeNote == "Citazione")
		getCitation();
}

function getAuthor(index) {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Un autore del documento &egrave;: ");
	//l deve contenere la lunghezza dell'array che contiene le annotazioni
	var i = 0;
	$(".typeNote").append('	<div class="col-lg-10"><select class="form-control" id="selectA"></select></div>');
	for ( i = 0; i < numero_note; i++) {
		if (arrayNewRes[index][i].label == "Autore") {
			$("#selectA").append("<option value='" + arrayNewRes[index][i].body.resource.label + "'>" + arrayNewRes[index][i].body.resource.label + "</option>");
		}
	}
}

function getYear() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Questo articolo &egrave; stato pubblicato nel: ");
	$(".typeNote").append('<div class="col-lg-10"><input class="form-control" id="inputforYear" type="number" min="1990" max="2015" value="">(Inserire valore tra 1990 e 2015)</div>');
}

function getTitle() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Il titolo del documento &egrave;: ");
	$(".typeNote").append("<div class='col-lg-10'><textarea class='form-control' rows='3' id='textAreaforTitle'></textarea></div>")
}

function getDOI() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Il DOI del documento &egrave;: ");
	$(".typeNote").append("<div class='col-lg-10'><input class='form-control' id='inputforDOI'></div>");
}

function getURL() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Questo denota un url: ");
	$(".typeNote").append("<div class='col-lg-10'><input type=URL class='form-control' id='inputforURL'></div>");
}

function getRethoric(){
  $("#labelCreaNota").empty();
  $("#labelCreaNota").html("Questo frammento rappresenta un: ");
  var tmp = "<div class='col-lg-10'>"+
  "<select class='form-control' id='selectR'>"+
  "<option value='Abstract'>Abstract</option>"+
  "<option value='Introduction'>Introduction</option>"+
  "<option value='Materials'>Materials</option>"+
  "<option value='Methods'>Methods</option>"+
  "<option value='Results'>Results</option>"+
  "<option value='Discussion'>Discussion</option>"+
  "<option value='Conclusion'>Conclusion</option>"+
  "</select>"+"</div>";
  $(".typeNote").append(tmp);
}

function getComment() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Un commento associato &grave;: ");
	$(".typeNote").append("<div class='col-lg-10'><textarea class='form-control' rows='3' id='textAreaforComment'></textarea></div>")
}

function getCitation() {
	$("#labelCreaNota").empty();
	$("#labelCreaNota").html("Questo denota una Citazione: ");
	$(".typeNote").append("<div class='col-lg-10'><input placeholder='URL' type=URL class='form-control' id='inputforURLCitation'><br>"+
								"<textarea placeholder='Titolo' class='form-control' rows='2' id='textAreaforCitesTitle'></textarea><br>"+
								"<input type=number class='form-control' placeholder='Anno di Pubblicazione (1990 - 2016)' id='yearForCites' min=1990 max=2016><br>"+
								"<input class='form-control' type=text id='DoiForCites' placeholder='DOI'><br>"+
								"<div class='listAddAuthor'><input type=button value=+ id='addauthorforcites'><input class='form-control newAuthor' type=text placeholder='Autore'><br>"+
								"</div></div>");

}

function saveNote() {
	var typeCSS,
	    title,
	    comment, titoloCites, yearCites, DoiCites,
	    label = $("#labelCreaNota").val();
	if (typeNote == "Autore") {
		typeCSS = "hasAuthor";
		val = $("#selectA").val();
		comment = label + " " + val;
	} else if (typeNote == "Titolo") {
		typeCSS = "hasTitle";
		val = $("#textAreaforTitle").val();
		comment = label + " " + val;
	} else if (typeNote == "DOI") {
		typeCSS = "hasDOI";
		val = $("#inputforDOI").val();
		comment = label + " " + val;
	} else if (typeNote == "Anno di pubblicazione") {
		typeCSS = "hasPublicationYear";
		val = $("#inputforYear").val();
		comment = label + " " + val;
	} else if (typeNote == "Retorica") {
		typeCSS = "denotesRhetoric";
		val = $("#selectR").val();
		comment = label + " " + val;
	//	alert(comment)
	} else if (typeNote == "Citazione") {
		typeCSS = "cites";
		val = $("#textAreaforCites").val();
		//label
		comment = $("#inputforURLCitation").val();
		titoloCites = $('#textAreaforCitesTitle').val();
		yearCites = $('#yearForCites').val();
		DoiCites = $('#DoiForCites').val();
		var leng = $('.listAddAuthor > input.newAuthor').size();
		var c;
		for(c = 0; c<leng; c++){
			var nAut = $('.listAddAuthor > input.newAuthor').eq(c).val();
			authorforCites.push(nAut)
		}

	} else if (typeNote == "Commento") {
		typeCSS = "hasComment";
		val = $("#textAreaforComment").val();
		comment = label + " " + val;
	} else if (typeNote == "URL") {
		typeCSS = "hasURL";
		val = $("#inputforURL").val();
		comment = label + " " + val;
	}

	// 2016-01-19T21:41

//	alert("ci sono: " + numeroNoteLocali);
	var date = new Date();
	var d = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"T"+date.getHours()+':'+date.getMinutes();
	numeroNoteLocali = numeroNoteLocali + 1;
	console.log(start, end);
	var n = {
		typeCSS : typeCSS,
		typeNote : typeNote,
		expression: currentExpression,
		url : currentArticle,
		id : id,
		start : start,
		end : end,
		val : val,
		name : name,
		mail : mail,
		comment : comment,
		num: numeroNoteLocali,
		date: d
	};

	//alert("stai creando la nota numero: " + numeroNoteLocali);
/*	if (typeNote == "Citazione"){
		   insertRangeCites(node, start, end,  numeroNoteLocali, typeCSS + " local", title, comment, d,  titoloCites , yearCites, DoiCites)
            authorforCites = [];
	}
	else	*/
	
	insertRange(node, start, end, numeroNoteLocali, typeCSS + " local", typeNote, comment,d);
	//Appende nella tabella
	var del = '<i onclick="deleteLocalNote(' + numeroNoteLocali + ')" class="delete-ann fa fa-times fa-lg"></i>';
	var tr = "<tr class='tr " + numeroNoteLocali + "'><td>" + titolo + "</td><td>" + typeNote + "</td><td>" + comment + "</td><td>" + del + "</td></tr>";
	$(".table-new-note").append(tr);


	noteLocali.push(n);

	//Abilita il tasto "salva sul triplestore"
	if (noteLocali.length > 0)
		$("#modal-changes .save-on-store").removeAttr("disabled");

}

function insertIntoTable(n, no, article){
	var del = '<i onclick="deleteLocalNote(' + n.start + ',' + n.end + ', null)" class="delete-ann fa fa-times fa-lg"></i>';
	var tr = "<tr class='tr " + no + "'><td>" + article + "</td><td>" + n.typeNote + "</td><td>" + n.comment + "</td><td>" + del + "</td></tr>";
	$(".table-new-note").append(tr);
	if (noteLocali.length > 0)
		$("#modal-changes .save-on-store").removeAttr("disabled");
}

function deleteLocalNote(no) {
	for (var i = 0; i < noteLocali.length; i++) {
		if (noteLocali[i].num == no) {
		//	noteLocali.splice(noteLocali[i], 1);
		noteLocali.splice(i, 1);
		$("#otherPage").find(".highlight." + no).removeClass("highlight");

			$(".tr." + no).remove();
			if (noteLocali.length == 0)
				$("#modal-changes .save-on-store").attr("disabled", "disabled");
			return;
		}
	}
}

function saveTostore() {
	//Invia al triplestore il contenuto dell'array noteLocali
	for (var i = 0; i < noteLocali.length; i++)
		sendToStore(noteLocali[i]);
	$("#modal-changes > div > div > div.modal-body > div > table > tbody").html("");
	alert_success();
	noteLocali = [];
}

var error = false;
function sendToStore(n) {
$("span.highlight.ltw1515."+n.num).attr("value",0);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "php/note_editors/note.php",
		data : JSON.stringify(n),
		success : function(d) {
			console.log(d);
			var i = parseInt($("#Numero_note").text()) + 1;
			$("#Numero_note").html(i);
		},
		error : function() {
			// alert("errore durante il salvataggio");
		}
	});
}
