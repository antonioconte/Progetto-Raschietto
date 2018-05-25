<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL | E_STRICT);
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';


//Passato l'url del documento mostra i gruppi che hanno fatto annotazioni su quel doc

$url = $_GET["url"];
$sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/query');
$list = file_get_contents("./lista_grafi.json");
$gruppo = json_decode($list, true);
$list_group = array();


for($i=0; $i<count($gruppo); $i++){

  $query_resources = 'SELECT DISTINCT *
  							FROM <http://vitali.web.cs.unibo.it/raschietto/graph/'.$gruppo[$i]["graph"].'>
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

  $res = $sparql->query($query_resources);
  $notetotali = count($res);
  if($notetotali>0){
    $a = array(
      'nome' => $gruppo[$i]["name"] ,
      'grafo' => $gruppo[$i]["graph"]
    );
    array_push($list_group, $a);
  }
}

/*
*/

echo json_encode($list_group,JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)



  ?>
