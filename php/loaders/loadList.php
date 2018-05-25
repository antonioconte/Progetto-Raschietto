<?php

/* Uso: http://.../loadList.php?url=[URL-Articolo-Dlib]
 * Questo script esamina il triplestore alla ricerca di
 * tutti gli articoli presenti, prendendone il titolo
 */

header('Content-Type: application/json; charset=UTF-8');
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';

$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');

$res_titles = $sparql->query('SELECT DISTINCT*
	FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	WHERE {
		 [ a rdf:Statement ;
			rdf:subject ?url ;
			rdf:predicate dcterms:title ;
			rdf:object ?title
		 ]
	}');

$res_authors = $sparql->query('SELECT DISTINCT ?author ?au_url
	FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	WHERE {
		[ a rdf:Statement ;
			rdf:subject ?url ;
			rdf:predicate dcterms:creator ;
			rdf:object ?au_url
		] .
		[ a rdf:Statement ;
			rdf:subject ?au_url ;
			rdf:predicate foaf:name ;
			rdf:object ?author
		]
	}');

$titles = array();

foreach ($res_titles as $row) {
	array_push($titles, array('title' => $row->title->__toString(), 'url' => $row->url->__toString()));
}

$authors = array();

foreach ($res_authors as $row) {
	array_push($authors, array('name' => $row->author->__toString(), 'url' => $row->au_url->__toString()));
}

$json = array();

$json = array_merge(array('titles' => $titles), array('authors' => $authors));


echo json_encode($json, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

?>
