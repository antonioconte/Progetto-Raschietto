<?php
/*
 * Permette di caricare una annotazione sul triple store
 */

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once 'RDFns.php';

error_reporting(E_ALL);

function annotate($type, $graph, $source, $selector, $start, $end, $subject, $predicate, $object, $bodyLabel, $objectLabel, $name, $mail) {
	$labels = array("rdf:type" => "Tipo", "fabio:hasPortrayal" => "Portrayal", "fabio:realization" => "Realizzation", "fabio:hasRepresentation" => "Representation", "dcterms:creator" => "Autore", "fabio:hasPublicationYear" => "Anno di pubblicazione", "dcterms:title" => "Titolo", "fabio:hasURL" => "URL", "schema:comment" => "Commento", "sem:denotes" => "Retorica", "cito:cites" => "Citazione", "prism:doi" => "DOI", "foaf:name" => "Nome");
	$time = date("Y-m-d\TH:i", time());
	if ($type == "literal") {						// Annotazione testo
		$annotation = '[ a oa:Annotation ;
		rdfs:label "' . $labels[$predicate] . '" ;
		oa:hasTarget [ a oa:SpecificResource ;
			       oa:hasSource ' . $source . ' ;
			       oa:hasSelector [  a oa:FragmentSelector ;
						 rdf:value "' . $selector . '" ;
						 oa:start "' . $start . '"^^xsd:nonNegativeInteger ;
						 oa:end "' . $end . '"^^xsd:nonNegativeInteger
					      ] ;
			     ] ;
		oa:hasBody [ a rdf:Statement ;
			     rdf:subject ' . $subject . ' ;
			     rdf:predicate ' . $predicate . ' ;
			     rdf:object "' . $object . '"^^xsd:string ;
				 rdfs:label "' . $bodyLabel . '"
		            ] ;
		oa:annotatedBy <mailto:' . $mail . '> ;
		oa:annotatedAt "' . $time . '"
		] .

		<mailto:' . $mail . '> foaf:name "' . $name . '" ;
			schema:email "' . $mail . '" .';
	} else if ($type == "resource") {				// Annotazione risorsa e frammento
		$annotation = '[ a oa:Annotation ;
		rdfs:label "' . $labels[$predicate] . '" ;
		oa:hasTarget [ a oa:SpecificResource ;
			       oa:hasSource ' . $source . ' ;
			       oa:hasSelector [  a oa:FragmentSelector ;
						 rdf:value "' . $selector . '" ;
						 oa:start "' . $start . '"^^xsd:nonNegativeInteger ;
						 oa:end "' . $end . '"^^xsd:nonNegativeInteger
					      ] ;
			     ] ;
		oa:hasBody [ a rdf:Statement ;
			     rdf:subject ' . $subject . ' ;
			     rdf:predicate ' . $predicate . ' ;
			     rdf:object ' . $object . ' ;
			     rdfs:label "' . $bodyLabel . '"
		            ] ;
		oa:annotatedBy <mailto:' . $mail . '> ;
		oa:annotatedAt "' . $time . '"
		] .

		' . $object . ' rdfs:label "' . $objectLabel . '" .

		<mailto:' . $mail . '> foaf:name "' . $name . '" ;
			schema:email "' . $mail . '" .';
	}
	//$parser -> parse($graph, $annotation, 'turtle', "");
	$store = new EasyRdf_Sparql_Client("http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1515?pass=ghKK08=Xa");
	$prefixes = '
		PREFIX : <http://www.example.com/>
		PREFIX application: <http://purl.org/NET/mediatypes/application/>
		PREFIX cito: <http://purl.org/net/cito/>
		PREFIX dcterms: <http://purl.org/dc/terms/>
		PREFIX deo: <http://purl.org/spar/deo/>
		PREFIX dlib: <http://www.dlib.org/dlib/march15/moulaison/>
		PREFIX fabio: <http://purl.org/spar/fabio>
		PREFIX foaf: <http://xmlns.com/foaf/0.1/>
		PREFIX frbr: <http://purl.org/vocab/frbr/core#>
		PREFIX oa: <http://www.w3.org/ns/oa#>
		PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/person/>
		PREFIX schema: <http://schema.org/>
		PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
		PREFIX sro: <http://salt.semanticauthoring.org/ontologies/sro#>
		PREFIX text: <http://purl.org/NET/mediatypes/text/>
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>';
	$query = $prefixes.'
	INSERT DATA {
  		GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
  		{'.$annotation.'}
  	}';
	$res = $store->update($query);
	//echo '<hr>'.$res;
	return $annotation;
}

/*$graph = new EasyRdf_Graph();

 $query0 = annotate(
 "literal",
 $graph,
 "dlib:03moulaison\.html",
 "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td2_p2",
 163,
 190,
 "dlib:03moulaison_ver1",
 "prism:doi",
 "10.1045/march2015-moulaison",
 NULL,
 NULL,
 "Lorenzo Vainigli",
 "lorenzo.vainigli@studio.unibo.it");

 $query1 = annotate(
 "resource",
 $graph,
 "dlib:03moulaison\.html",
 "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td2_p2",
 163,
 190,
 "dlib:03moulaison_ver1",
 "dcterms:creator",
 "rsch:moulaison-h",
 "Un autore del documento è Heather Lea Moulaison",
 "Heather Lea Moulaison",
 "Lorenzo Vainigli",
 "lorenzo.vainigli@studio.unibo.it");

 echo $query1;*/
?>
