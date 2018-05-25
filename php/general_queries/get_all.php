<?php

// Scarica tutte le triple

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';

$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');

$query = ' SELECT *
		FROM <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
		WHERE {
	        ?s ?p ?o
	    }'; 

$res = $sparql -> query($query);
echo $res->numRows().'<br/>';
echo $res->dump();

// foreach ($res as $row) {
	// echo $row->s->__toString().' | '.$row->p->__toString().' | '.$row->o->__toString();
// }
?>