<?php
    /*Ritorna tutti gli articoli nel triple store */

    header('Content-Type: application/json');
    require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
    require_once '../note_editors/RDFns.php';
    $sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');

    $res = $sparql->query(
	    'SELECT DISTINCT ?url ?titolo
	    FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	     WHERE {
		 [ a rdf:Statement ;
			rdf:subject ?url ;
			rdf:predicate dcterms:title ;
			rdf:object ?titolo
		 ]
	}
    	ORDER BY ?titolo'
    	);
		
	$list = array();

	foreach ($res as $row) array_push($list, array("url" => "".$row->url."" ,"title" => "".$row->titolo.""));

    echo json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

?>
