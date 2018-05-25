<?php
    
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once './RDFns.php';
	$data = json_decode(file_get_contents("php://input"),true);
	$old_data = json_decode($data[0], TRUE);
	$new_data = json_decode($data[1], TRUE);
    
    $new_data['provenance']['time'] = date('Y-m-d')."T".date('H:i');
	
    $sparql = new EasyRdf_Sparql_Client('http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1515?pass=ghKK08=Xa');
    if ($old_data['label'] == "Autore" || $old_data['label'] == "Citazione" || $old_data['label'] == "URL") {						// Annotazione testo	
    	$query_body_old = '{
                ?note a oa:Annotation ;
					rdfs:label "' . $old_data['label'] . '" ;
					oa:hasTarget ?resource ;
					oa:hasBody ?body ;
					oa:annotatedBy <mailto:' . $old_data['provenance']['author']['email'] . '> ;
					oa:annotatedAt "' . $old_data['provenance']['time'] . '" .
					
				?resource a oa:SpecificResource ;
			       oa:hasSource <' . $old_data['target']['source'] . '> ;
			       oa:hasSelector ?selector .
			
	       		?selector a oa:FragmentSelector ;
					 rdf:value "' . $old_data['target']['id'] . '" ;
					 oa:start "' . $old_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
					 oa:end "' . $old_data['target']['end'] . '"^^xsd:nonNegativeInteger .				
					
				?body a rdf:Statement ;
				     rdf:subject <' . $old_data['body']['subject'] . '> ;
				     rdf:predicate <' . $old_data['body']['predicate'] . '> ;
				     rdf:object <' . $old_data['body']['resource']['id'] . '> ;
					 rdfs:label "' . $old_data['body']['label'] . '" .
				
				<' . $old_data['body']['resource']['id'] . '> rdfs:label "' . $old_data['body']['resource']['label'] . '" .
		
				<mailto:' . $old_data['provenance']['author']['email'] . '> foaf:name "' . $old_data['provenance']['author']['name'] . '" ;
					schema:email "' . $old_data['provenance']['author']['email'] . '" .
                }';
				
		$query_body_new = '{
                [ a oa:Annotation ;
				rdfs:label "' . $new_data['label'] . '" ;
				oa:hasTarget [ a oa:SpecificResource ;
					       oa:hasSource <' . $new_data['target']['source'] . '> ;
					       oa:hasSelector [  a oa:FragmentSelector ;
								 rdf:value "' . $new_data['target']['id'] . '" ;
								 oa:start "' . $new_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
								 oa:end "' . $new_data['target']['end'] . '"^^xsd:nonNegativeInteger
							      ] ;
					     ] ;
				oa:hasBody [ a rdf:Statement ;
					     rdf:subject <' . $new_data['body']['subject'] . '> ;
					     rdf:predicate <' . $new_data['body']['predicate'] . '> ;
					     rdf:object <' . $new_data['body']['resource']['id'] . '> ;
						 rdfs:label "' . $new_data['body']['label'] . '"
				            ] ;
				oa:annotatedBy <mailto:' . $new_data['provenance']['author']['email'] . '> ;
				oa:annotatedAt "' . $new_data['provenance']['time'] . '"
				] .
				
				<' . $new_data['body']['resource']['id'] . '> rdfs:label "' . $new_data['body']['resource']['label'] . '" .
				
				<mailto:' . $new_data['provenance']['author']['email'] . '> foaf:name "' . $new_data['provenance']['author']['name'] . '" ;
					schema:email "' . $new_data['provenance']['author']['email'] . '" .
				}';
    } else if ($old_data['label'] == "Titolo" || $old_data['label'] == "DOI" || $old_data['label'] == "Commento" || $old_data['label'] == "Anno di pubblicazione"){
       $query_body_old = '{
                ?note a oa:Annotation ;
					rdfs:label "' . $old_data['label'] . '" ;
					oa:hasTarget ?resource ;
					oa:hasBody ?body ;
					oa:annotatedBy <mailto:' . $old_data['provenance']['author']['email'] . '> ;
					oa:annotatedAt "' . $old_data['provenance']['time'] . '" .
					
				?resource a oa:SpecificResource ;
			       oa:hasSource <' . $old_data['target']['source'] . '> ;
			       oa:hasSelector ?selector .
			
	       		?selector a oa:FragmentSelector ;
					 rdf:value "' . $old_data['target']['id'] . '" ;
					 oa:start "' . $old_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
					 oa:end "' . $old_data['target']['end'] . '"^^xsd:nonNegativeInteger .				
					
				?body a rdf:Statement ;
				     rdf:subject <' . $old_data['body']['subject'] . '> ;
				     rdf:predicate <' . $old_data['body']['predicate'] . '> ;
				     rdf:object "' . $old_data['body']['literal'] . '"^^xsd:string ;
					 rdfs:label "' . $old_data['body']['label'] . '" .
				
				<mailto:' . $old_data['provenance']['author']['email'] . '> foaf:name "' . $old_data['provenance']['author']['name'] . '" ;
					schema:email "' . $old_data['provenance']['author']['email'] . '" .
                }';
				
		$query_body_new = '{
                [ a oa:Annotation ;
				rdfs:label "' . $new_data['label'] . '" ;
				oa:hasTarget [ a oa:SpecificResource ;
					       oa:hasSource <' . $new_data['target']['source'] . '> ;
					       oa:hasSelector [  a oa:FragmentSelector ;
								 rdf:value "' . $new_data['target']['id'] . '" ;
								 oa:start "' . $new_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
								 oa:end "' . $new_data['target']['end'] . '"^^xsd:nonNegativeInteger
							      ] ;
					     ] ;
				oa:hasBody [ a rdf:Statement ;
					     rdf:subject <' . $new_data['body']['subject'] . '> ;
					     rdf:predicate <' . $new_data['body']['predicate'] . '> ;
					     rdf:object "' . $new_data['body']['literal'] . '"^^xsd:string ;
						 rdfs:label "' . $new_data['body']['label'] . '"
				            ] ;
				oa:annotatedBy <mailto:' . $new_data['provenance']['author']['email'] . '> ;
				oa:annotatedAt "' . $new_data['provenance']['time'] . '"
				] .
	
				<mailto:' . $new_data['provenance']['author']['email'] . '> foaf:name "' . $new_data['provenance']['author']['name'] . '" ;
					schema:email "' . $new_data['provenance']['author']['email'] . '" .
				}';
    } else if ($old_data['label'] == "Retorica"){
    	       $query_body_old = '{
                ?note a oa:Annotation ;
					rdfs:label "' . $old_data['label'] . '" ;
					oa:hasTarget ?resource ;
					oa:hasBody ?body ;
					oa:annotatedBy <mailto:' . $old_data['provenance']['author']['email'] . '> ;
					oa:annotatedAt "' . $old_data['provenance']['time'] . '" .
					
				?resource a oa:SpecificResource ;
			       oa:hasSource <' . $old_data['target']['source'] . '> ;
			       oa:hasSelector ?selector .
			
	       		?selector a oa:FragmentSelector ;
					 rdf:value "' . $old_data['target']['id'] . '" ;
					 oa:start "' . $old_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
					 oa:end "' . $old_data['target']['end'] . '"^^xsd:nonNegativeInteger .				
					
				?body a rdf:Statement ;
				     rdf:subject <' . $old_data['body']['subject'] . '> ;
				     rdf:predicate <' . $old_data['body']['predicate'] . '> ;
				     rdf:object <' . $old_data['body']['literal'] . '> ;
					 rdfs:label "' . $old_data['body']['label'] . '" .
				
				<mailto:' . $old_data['provenance']['author']['email'] . '> foaf:name "' . $old_data['provenance']['author']['name'] . '" ;
					schema:email "' . $old_data['provenance']['author']['email'] . '" .
                }';
				
		$query_body_new = '{
                [ a oa:Annotation ;
				rdfs:label "' . $new_data['label'] . '" ;
				oa:hasTarget [ a oa:SpecificResource ;
					       oa:hasSource <' . $new_data['target']['source'] . '> ;
					       oa:hasSelector [  a oa:FragmentSelector ;
								 rdf:value "' . $new_data['target']['id'] . '" ;
								 oa:start "' . $new_data['target']['start'] . '"^^xsd:nonNegativeInteger ;
								 oa:end "' . $new_data['target']['end'] . '"^^xsd:nonNegativeInteger
							      ] ;
					     ] ;
				oa:hasBody [ a rdf:Statement ;
					     rdf:subject <' . $new_data['body']['subject'] . '> ;
					     rdf:predicate <' . $new_data['body']['predicate'] . '> ;
					     rdf:object <' . $new_data['body']['literal'] . '> ;
						 rdfs:label "' . $new_data['body']['label'] . '"
				            ] ;
				oa:annotatedBy <mailto:' . $new_data['provenance']['author']['email'] . '> ;
				oa:annotatedAt "' . $new_data['provenance']['time'] . '"
				] .
	
				<mailto:' . $new_data['provenance']['author']['email'] . '> foaf:name "' . $new_data['provenance']['author']['name'] . '" ;
					schema:email "' . $new_data['provenance']['author']['email'] . '" .
				}';
    }
	// DELETE { GRAPH <g1> { a b c } } INSERT { GRAPH <g1> { x y z } } USING <g1> WHERE { ... }
    $query = 'DELETE {
    	GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
    	'. $query_body_old . ' 
    }
  	INSERT {
  		GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
  		'. $query_body_new .'
  	}
  	WHERE ' . $query_body_old;
    echo $query;
    $res = $sparql->update($query);
    echo $res;
?>
