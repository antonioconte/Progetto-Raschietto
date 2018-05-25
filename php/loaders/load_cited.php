<?php

/* Uso: http://.../load.php?url=[URL-Articolo-Dlib]
 * Questo script esamina il triplestore alla ricerca di
 * tutte le info disponibili dell'articolo passato come url
 */

error_reporting(E_ALL);
header('Content-Type: application/json');
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';

$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');
$url = $_GET["url"];

$json = array();
$ann = array();
$tmp = array();

$types = array(
	"Autore" => "hasAuthor",
	"Anno di pubblicazione" => "hasPublicationYear",
	"Titolo" => "hasTitle",
	"URL" => "hasURL",
	"Commento" => "hasComment",
	"Retorica" => "denotesRhetoric",
	"Citazione" => "cites",
	"DOI" => "hasDOI",
);

$citer = '[ a oa:Annotation ;
			oa:hasTarget [ a oa:SpecificResource ;
				       oa:hasSource <'.$url.'> ;
				        ] ;
			oa:hasBody [ a rdf:Statement ;
				     rdf:subject ?citer ;
				     rdf:predicate cito:cites ;
				     rdf:object ?cited
			            ]
		] .';

// Richiedo le annotazioni su risorsa
$query_resources = 'SELECT DISTINCT *
	FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	WHERE {'.$citer.'
		[ a oa:Annotation ;
			rdfs:label ?label ;
			oa:hasTarget [ a oa:SpecificResource ;
				       oa:hasSource ?url ;
				       oa:hasSelector [  a oa:FragmentSelector ;
							 rdf:value ?id ;
							 oa:start ?start ;
							 oa:end ?end
						      ] ;
				     ] ;
			oa:hasBody [ a rdf:Statement ;
				     rdf:subject ?cited ;
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

// Richiedo le annotazioni letterali
$query_literals = 'SELECT DISTINCT *
	FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	WHERE {'.$citer.'
		[ a oa:Annotation ;
			rdfs:label ?label ;
			oa:hasTarget [ a oa:SpecificResource ;
				       oa:hasSource ?url ;
				       oa:hasSelector [  a oa:FragmentSelector ;
							 rdf:value ?id ;
							 oa:start ?start ;
							 oa:end ?end
						      ] ;
				     ] ;
			oa:hasBody [ a rdf:Statement ;
				     rdf:subject ?cited ;
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

$res_resources = $sparql->query($query_resources);
$res_literals = $sparql->query($query_literals);
//echo $res->dump();
if ($res_resources->numRows()==0 && $res_literals->numRows()==0){
	exit('No Matches!');
}

foreach ($res_resources as $row) {
	$label = $row->label->__toString();
	if ($label == 'Autore' || $label == 'Citazione'){
		// Annotazione risorsa
		$ann = array(
			"type" => $types[$row->label->__toString()],
			"label" => $row->label->__toString(),
			"body" => array(
					"label" => $row->bodylabel->__toString(),
					"subject" => $row->cited->__toString(),
					"predicate" => $row->predicate->__toString(),
					"resource" => array(
						"id" => $row->object->__toString(),
						"label" => $row->objectlabel->__toString(),
					),
				),
			"target" => array(
					"source" => $row->url->__toString(),
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
}

foreach ($res_literals as $row) {
	$label = $row->label->__toString();
	if ($label != 'Autore' && $label != 'Citazione'){
		// Annotazione letterale
		$ann = array(
			"type" => $types[$row->label->__toString()],
			"label" => $row->label->__toString(),
			"body" => array(
					"label" => $row->bodylabel->__toString(),
					"subject" => $row->cited->__toString(),
					"predicate" => $row->predicate->__toString(),
					"literal" => $row->object->__toString()
				),
			"target" => array(
					"source" => $row->url->__toString(),
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
}

echo json_encode($json, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

?>
