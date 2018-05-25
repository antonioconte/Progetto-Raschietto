<?php

// Elimina tutte le note riferite ad un documento

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';

$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1515?pass=ghKK08=Xa');

$query1 = ' DELETE {
		GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
		{
	        ?s ?p ?o
	    }
    }
	WHERE { ?s ?p ?o}'; 

echo $sparql -> update($query1);
?>
