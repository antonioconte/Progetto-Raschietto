<?php

/* Uso: http://.../scrape?url=[URL-Articolo-Dlib]
 * Questo script esamina un articolo di DLib.org e ne estrapola
 * tutte le info utili sotto forma di triple RDF
 */
error_reporting(E_ALL);
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';
require_once 'dlib.php';
require_once 'statistica.php';
require_once 'almajournal.php';

$urls = array();

if (!isset($_GET["url"])){
	echo "Error, missing url!";
} else {
	array_push($urls, $_GET["url"]);
}


$dlib = "dlib.org";
$statistica = "rivista-statistica.unibo.it";
$montesquieu = "montesquieu.unibo.it";
$intrecci = "intreccidarte.unibo.it";
foreach ($urls as $url) {
	if (strstr($url, $dlib)){
		$article = new DLib($url);
	} else if (strstr($url, $montesquieu) || strstr($url, $intrecci)){
		$article = new AlmaJournal($url);
	} else if (strstr($url, $statistica)){
		$article = new Statistica($url);
	}
 // $result = $store->insertIntoDefault($article->graph);
  
	//echo $article->graph->dump();
}
?>
