<?php
/*
 * Use: loadExternal.php?url=[URL TO LOAD]
 */
error_reporting(0);
header('Content-Type: application/json');

function XPathTofragID($nodepath) {
	$nodepath = str_replace(array('/html', '/body/', '[', ']', '/'), array('', '', '', '', '_'), $nodepath);
	// Mette un 1 dove c'è un elemento senza numero
	// $0 fa riferimento a tuttI i match
	// $i fa riferimento all'i-esimo match, cioè riferito al pattern tra le i-esime parentesi tonde
	$pattern = array('/([a-z]+)(?![0-9]+)(\_|$)/', '/(h([1-6])(?![0-9]+))/');
	$replace = array('${1}1${2}', '${0}1');
	$nodepath = preg_replace($pattern, $replace, $nodepath);
	return $nodepath;
}

// Trovo tutti i nodi img a cui cambio gli url relativi in assoluti
function setURLs(&$node, $url) {
	//echo $node->getNodePath()."<br/>";
	foreach ($node->attributes as $attr) {
		if ($attr -> nodeName == "src" || $attr -> nodeName == "href") {
			// Da URL relativo a URL assoluto
			$attr -> nodeValue = substr($url, 0, strrpos($url, '/', -1) + 1) . $attr -> nodeValue;
		}
	}
	$childlist = $node -> childNodes;
	foreach ($childlist as $child) {
		setURLs($child, $url);
	}
}

// Imposto l'ID di ogni nodo con la stringa che identifica il suo frammento
function setIDs(&$node) {
	//echo $node -> getNodePath() . "<br/>";
	if ($node->nodeType!=3 && $node->nodeType!=8 && $node->nodeName!='br'){ // 3 = testo, 8 = commento
		//echo XPathTofragID($node -> getNodePath()) . "<br/>";
		$node->setAttribute("id", XPathTofragID($node -> getNodePath()));
	}
	$childlist = $node -> childNodes;
	foreach ($childlist as $child) {
		setIDs($child, $url);
	}
}

$url = $_GET['url'];
$dom = new DOMDocument();
$root = new DOMNode();
$dom -> loadHTMLFile($url);
$xpath = new DOMXPath($dom);
if (strstr($url, 'dlib')) {
	if (strstr($url, '#')) {
		$nodepath = substr($url, strpos($url, '#') + 1);
		// Traduco un identificativo di frammento in un xpath
		$nodepath = str_replace(array('_', '1', '/tbody'), array('/', '', ''), $nodepath);
		$nodepath = preg_replace('/[0-9]+/', '[$0]', $nodepath);
		$root = $xpath -> query('//' . $nodepath) -> item(0);
	} else {
		$root = $xpath -> query('/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]') -> item(0);
	}
	setURLs($root, $url);
	setIDs($root);
	$newdom = new DOMNode();
	foreach ($root->childNodes as $node) {
		$html .= $dom -> saveHTML($node);
	}
	echo json_encode(array($html), JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} else if (strstr($url, 'montesquieu.unibo.it') || strstr($url, 'intreccidarte.unibo.it')) {
	include "loadAlmaJournalHtml.php";
} else if (strstr($url, 'rivista-statistica.unibo.it')) {
	include "loadStatisticaHtml.php";
}
?>
