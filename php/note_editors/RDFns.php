<?php

EasyRdf_Namespace::set('dlib', 'http://www.dlib.org/dlib/');
EasyRdf_Namespace::set('fabio', 'http://purl.org/spar/fabio');
EasyRdf_Namespace::set('frbr', 'http://purl.org/vocab/frbr/core#');
EasyRdf_Namespace::set('rsch', 'http://vitali.web.cs.unibo.it/raschietto/person/');
EasyRdf_Namespace::set('sro', 'http://salt.semanticauthoring.org/ontologies/sro#');
EasyRdf_Namespace::set('deo', 'http://purl.org/spar/deo/');
EasyRdf_Namespace::set("oa", "http://www.w3.org/ns/oa#");
EasyRdf_Namespace::set("sem", "http://semanticweb.cs.vu.nl/2009/11/sem/");
EasyRdf_Namespace::set("prism", "http://prismstandard.org/namespaces/basic/2.0/");
EasyRdf_Namespace::set("cito", "http://purl.org/net/cito/");

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


?>