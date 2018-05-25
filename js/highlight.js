// Calcola la sottostringa indicata da start ed end senza considerare i tag html
function subStrNoTags(str, start, end) {
	var returnString = "";
	var inTag = false;
	var i = 0;
	var j = 0;
	while (j < end && str[i]) {
		if (j >= start) {
			returnString += str[i];
		}
		var exit = false;
		if (str[i] == "<") {
			inTag = true;
		} else if (str[i] == ">") {
			inTag = false;
			exit = true;
		}
		if (!exit && !inTag) {
			j++;
		}
		i++;
	}
	return returnString;
}

// splitNode e getNode index sevono a risolvere il problema delle annotazioni intersecate
// http://jsbin.com/vaveyojoro/edit?html,js,output
function splitNode(node, offset, limit) {
	var parent = limit.parentNode;
	var parentOffset = getNodeIndex(parent, limit);
	var doc = node.ownerDocument;
	var leftRange = doc.createRange();
	leftRange.setStart(parent, parentOffset);
	leftRange.setEnd(node, offset);
	var left = leftRange.extractContents();
	parent.insertBefore(left, limit);
}

function getNodeIndex(parent, node) {
	var index = parent.childNodes.length;
	while (index--) {
		if (node === parent.childNodes[index]) {
			break;
		}
	}
	return index;
}

// Ritorna un array con tutti i nodi foglia discendenti di node, visitati da sinistra verso destra
function leafArray(node, array) {
	if (!node.hasChildNodes()) {
		if (node.nodeType == 3) {// 3 identifica i nodi testo
			array.push(node);
			//console.log(node.textContent);
		}
	} else {
		var childs = node.childNodes;
		for (var i = 0; i < childs.length; i++) {
			leafArray(childs[i], array);
		}
	}
}

function insertRange(node, start, end, num, type, title, content, time) {
	//se l'end è maggiore del numero effettivo dei caratteri del paragrafo imposto limite
	var l = $("#"+node.id).text().length;
	if(end > l) end = l;

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
	var x;
	var span = document.createElement('span');
	if(type.indexOf("local")>0){
		 x = type.split(" ");
		 span.setAttribute("value", 1)
		 type = x[0];
		 	console.log(x[1]);
	}
	else{
		span.setAttribute("value", 0);
	}
	span.setAttribute('class', 'highlight ltw1515 ' + num + ' ' + type);
	span.setAttribute('data-toggle', 'popover');
	span.setAttribute('title', title);
	span.setAttribute('autore', "ltw1515");
	span.setAttribute('tempo', time);

	span.setAttribute('data-content', content);
	r.surroundContents(span);
}

//Evidenzia la parte dell'articolo
function createHighlight(selector, start, end, details, num, time) {
	$.ajax({
		method : "GET",
		url : "./php/path_translator.php?str=" + selector + "&out=path",
		dataType : 'json',
		success : function(res) {
			// Modifico l'XPath per adattarlo alla struttura pagina
			if (currentArticle.indexOf("dlib") > -1) {// E' un articolo dlib?
				var strtodelete = "form[1]/table[3]/tr[1]/td[1]/table[5]/tr[1]/td[1]/table[1]/tr[1]/td[2]";
				res = res.replace(strtodelete, "");
				var xpath = '//*[@id="otherPage"]/' + res;
				var node = document.evaluate(xpath, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (start == "") {
					start = 0;
				}
				if (end == "") {
					end = node.textContent.length;
				}
				//console.log(xpath);
				insertRange(node, start, end, num, details["type"], eval(num + 1) + '. ' + details["label"], details["body"]["label"], time);
				/*num = eval(num+1);
				 console.log(subStrNoTags(node.innerHTML, 0, start));
				 console.log(subStrNoTags(node.innerHTML, start, end));
				 console.log(subStrNoTags(node.innerHTML, end, node.innerHTML.length));
				 node.innerHTML = subStrNoTags(node.innerHTML, 0, start) + '<span class="highlight ' +
				 num + '" data-toggle="popover"  title="'+ num + '. ' + details["label"]+ '" data-content="'+details["body"]["label"]+'">' + subStrNoTags(node.innerHTML, start, end) +
				 '</span>' + subStrNoTags(node.innerHTML, end, node.innerHTML.length);*/

			}
		},
		error : function() {
			alert("Errore in path_translator!");
		}
	});
}
