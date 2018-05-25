<?php
header('Content-Type: application/json');
error_reporting(0);
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';

//
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL | E_STRICT);

$url = $_GET["url"];
$gruppo = $_GET["gruppo"];

$types = array(
	"Autore" => "hasAuthor",
	"autore" => "hasAuthor",
	"anno di pubblicazione" => "hasPublicationYear",
	"anno" => "hasPublicationYear",
	"Anno" => "hasPublicationYear",
	"Titolo" => "hasTitle",
	"Title" => "hasTitle",
	"title" => "hasTitle",
	"titolo" => "hasTitle",
	"indirizzo" => "hasURL",
	"url" => "hasURL",
	"URL" => "hasURL",
	"Url" => "hasURL",
	"Commento" => "hasComment",
	"commento" => "hasComment",
	"Retorica" => "denotesRhetoric",
	"retorica" => "denotesRhetoric",
	"Cites" => "cites",
	"cites" => "cites",
	"Citazione" => "cites",
	"citazione" => "cites",
	"Doi" => "hasDOI",
	"doi" => "hasDOI",
	"DOI" => "hasDOI",
);


$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');
$query_resources = 'SELECT DISTINCT *
							FROM <http://vitali.web.cs.unibo.it/raschietto/graph/'.$gruppo.'>
							WHERE {
							[ a oa:Annotation ;
							rdfs:label ?label ;
							oa:hasTarget [ a oa:SpecificResource ;
							oa:hasSource <'.$url.'> ;
							oa:hasSelector [  a oa:FragmentSelector ;
							rdf:value ?id ;
							oa:start ?start ;
							oa:end ?end
							] ;
							] ;
							oa:hasBody [ a rdf:Statement ;
							rdf:subject ?subject ;
							rdf:predicate ?predicate ;
							rdf:object ?object ;
							rdfs:label ?bodylabel
							] ;
							oa:annotatedBy ?mailto ;
							oa:annotatedAt ?time
							] .

							?object rdfs:label ?objectlabel.

							?mailto foaf:name ?name ;
							schema:email ?mail .
						}';

$res = $sparql->query($query_resources);

$json = array();
foreach ($res as $row) {
	
	$ann = array(
		"type" => $types[$row->label->__toString()],
		"label" => $row->label->__toString(),
		"body" => array(
			"label" => $row->bodylabel->__toString(),
			"subject" => $row->subject->__toString(),
			"predicate" => $row->predicate->__toString(),
			"resource" => array(
				"id" => $row->object->__toString(),
				"label" => $row->objectlabel->__toString(),
			),
		),
		"target" => array(
			"source" => $url,
			"id" => $row->id->__toString(),
			"start" => $row->start->__toString(),
			"end" => $row->end->__toString()
		),
		"provenance" => array(
			"author" => array(
				"name" => $row->name->__toString(),
				"email" => $row->mail->__toString()
			),
			"time" => $row->time->__toString()
			)
		);
		array_push($json, $ann);

	}


	$query_literals = 'SELECT DISTINCT *
				FROM <http://vitali.web.cs.unibo.it/raschietto/graph/'.$gruppo.'>
				WHERE {
				[ a oa:Annotation ;
				rdfs:label ?label ;
				oa:hasTarget [ a oa:SpecificResource ;
				oa:hasSource <'.$url.'> ;
				oa:hasSelector [  a oa:FragmentSelector ;
				rdf:value ?id ;
				oa:start ?start ;
				oa:end ?end
				] ;
				] ;
				oa:hasBody [ a rdf:Statement ;
				rdf:subject ?subject ;
				rdf:predicate ?predicate ;
				rdf:object ?object ;
				rdfs:label ?bodylabel
				] ;
				oa:annotatedBy ?mailto ;
				oa:annotatedAt ?time
				] .

				?mailto foaf:name ?name ;
				schema:email ?mail .
}';

$res = $sparql->query($query_literals);
foreach ($res as $row){
	$ann = array(
		"type" => $types[$row->label->__toString()],
		"label" => $row->label->__toString(),
		"body" => array(
			"label" => $row->bodylabel->__toString(),
			"subject" => $row->subject->__toString(),
			"predicate" => $row->predicate->__toString(),
			"literal" => $row->object->__toString()
		),
		"target" => array(
			"source" => $url,
			"id" => $row->id->__toString(),
			"start" => $row->start->__toString(),
			"end" => $row->end->__toString()
		),
		"provenance" => array(
			"author" => array(
				"name" => $row->name->__toString(),
				"email" => $row->mail->__toString()
			),
			"time" => $row->time->__toString()
			)
		);
		array_push($json, $ann);
	}

// echo count($json);
echo json_encode($json, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
	?>
