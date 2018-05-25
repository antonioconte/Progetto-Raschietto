<?php

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once './RDFns.php';


$data = json_decode(file_get_contents("php://input"),true) ;

//per la cancellazione di una nota richiede:
//Url del doc
//label (quella piu esterna che ident il tipo di nota)
//id
//start
//end



$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1515?pass=ghKK08=Xa');

//CITAZIONE e AUTORE
if($data["tipo"] == "Citazione" || $data["tipo"] == "Autore") {
    $query = ' DELETE {
    GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
    {
     ?note a oa:Annotation
    }
    }
	WHERE{
        ?note a oa:Annotation ;
        rdfs:label "'.$data["tipo"].'" ;
        oa:hasTarget ?target ;
        oa:hasBody ?body ;
        oa:annotatedBy ?mailto ;
        oa:annotatedAt ?time .

        ?body a rdf:Statement ;
        rdf:subject ?subject ;
        rdf:predicate ?predicate ;
        rdf:object ?object ;
        rdfs:label ?bodylabel .

        ?target a oa:SpecificResource ;
        oa:hasSource <'.$data["url"].'> ;
        oa:hasSelector ?selector .

        ?selector a oa:FragmentSelector ;
        rdf:value "'.$data["id"].'" ;
        oa:start '.$data["start"].' ;
        oa:end '.$data["end"].' .

        ?object rdfs:label ?objectlabel.
    }';
}
//TITOLO DOI RETORICA ANNOdiPUBBLICAZIONE COMMENTO ------------------ MANCA L'URL
else{
    $query = ' DELETE{
    GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	 {
		?note a oa:Annotation
	 }
   }
    WHERE{
        ?note a oa:Annotation ;
        rdfs:label "'.$data["tipo"].'" ;
        oa:hasTarget ?target ;
        oa:hasBody ?body ;
        oa:annotatedBy ?mailto ;
        oa:annotatedAt ?time .

        ?body a rdf:Statement ;
        rdf:subject ?subject ;
        rdf:predicate ?predicate ;
        rdf:object ?object ;
        rdfs:label ?bodylabel .

        ?target a oa:SpecificResource ;
        oa:hasSource <'.$data["url"].'> ;
        oa:hasSelector ?selector .

        ?selector a oa:FragmentSelector ;
        rdf:value "'.$data["id"].'" ;
        oa:start '.$data["start"].' ;
        oa:end '.$data["end"].' .
    }';

}
echo $sparql->update($query);

?>
