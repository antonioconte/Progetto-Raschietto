<?php
    //header('Content-Type: text/html; charset=utf-8');
    //header('Content-Type: application/json');
    error_reporting(E_ALL);
require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once './RDFns.php';
    require 'annotate.php';

    $graph = new EasyRdf_Graph();
    $data = json_decode(file_get_contents("php://input"),true) ;
    // echo $data["typeNote"];
    // echo $data["type"];
    // echo $data["url"];
    // echo $data["id"];
    // echo $data["start"];
    // echo $data["end"];
    // echo $data["val"];
    // echo $data["name"];
    // echo $data["mail"];

    // $data["val"] = "Abstract";
    // $data["url"] = "http://rivista-statistica.unibo.it/article/view/5500";
    // $data["start"] = 12;
    // $data["end"] = 15;
    // $data["id"] = "div1_div2_div2_div3_div7_div1_p1";
    //$data["name"] = "Antonio";
    //$data["mail"] = "mail#@gmail.com";


    if($data["typeNote"] == "Retorica"){
        $obj = NULL;
        if ($data["val"] == 'Abstract') $obj = 'sro:Abstract';
        else if ($data["val"] == 'Introduction') $obj = 'deo:Introduction';
        else if ($data["val"] == 'Materials') $obj = 'deo:Materials';
        else if ($data["val"] == 'Methods') $obj = 'deo:Methods';
        else if ($data["val"] == 'Results') $obj = 'deo:Results';
        else if ($data["val"] == 'Discussion') $obj = 'sro:Discussion';
        else if ($data["val"] == 'Conclusion') $obj = 'sro:Conclusion';
        annotate(
            "resource",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$data["id"].'>',
            "sem:denotes",
            $obj,
            "Questo frammento denota un ".$data["val"],
            $data["val"],
            $data["name"],
            $data["mail"]
        );
    }
    else if($data["typeNote"] == "Titolo"){
        annotate(
            "literal",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$data["url"].'>',
            "dcterms:title",
            $data["val"],
            "Il titolo di questo articolo è:".$data["val"],
            NULL,
            $data["name"],
            $data["mail"]);
    }
    else if($data["typeNote"] == "Anno di pubblicazione"){
        $exp = explode(".html",$data["url"]);
        $exp[0] = $exp[0]."_ver1";
        annotate(
            "literal",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$exp[0].'>',
            "fabio:hasPublicationYear",
            $data["val"],
            "Questo articolo è stato pubblicato nel: ".$data["val"],
            NULL,
            $data["name"],
            $data["mail"]);
    }
    else if($data["typeNote"] == "Autore" ){
        $name = substr_replace($data["val"], '-', 1, strpos($data["val"], ' '));
        $name = str_replace(' ', '', $name);
        $name = 'rsch:'.strtolower($name);

        $exp = explode(".html",$data["url"]);
        $exp[0] = $exp[0]."_ver1";

        annotate(
            "literal",
            $graph,
            $name,
            NULL,
            NULL,
            NULL,
            $name,
            "rdf:type",
            $data["val"],
            NULL,
            NULL,
            $data["name"],
            $data["mail"]);
        annotate(
            "literal",
            $graph,
            $name,
            NULL,
            NULL,
            NULL,
            $name,
            "foaf:name",
            $data["val"],
            NULL,
            NULL,
            $data["name"],
            $data["mail"]);
        annotate(
            "resource",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$exp[0].'>',
            "dcterms:creator",
            $name,
            "Un autore del documento è ".$data["val"],
            $data["val"],
            $data["name"],
            $data["mail"]);

    }
    else if($data["typeNote"] == "Citazione"){
        $exp = explode(".html",$data["url"]);
        $exp[0] = $exp[0]."_ver1";
        annotate(
            "resource",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$exp[0].'>',
            "cito:cites",
            '<'.$data["comment"].'>', //url
            "Un documento citato è ".$data["val"],  //label
            $data["val"], //label
            $data["name"],
            $data["mail"]);
    }
    else if($data["typeNote"] == "DOI"){
        $exp = explode(".html",$data["url"]);
        $exp[0] = $exp[0]."_ver1";
        annotate(
            "literal",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$exp[0].'>',
            "prism:doi",
            $data["val"],
            "Il doi del documento è ".$data["val"],
            NULL,
            $data["name"],
            $data["mail"]);
    }
    else if($data["typeNote"] == "Commento"){
        annotate(
            "literal",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$data["url"].'>',
            "schema:comment",
            $data["val"],
            "Un commento associato a questo frammento è: ".$data["val"],
            NULL,
            $data["name"],
            $data["mail"]);

    }
    else if($data["typeNote"] == "URL"){
        $exp = explode(".html",$data["url"]);
        $exp[0] = $exp[0]."_ver1";

        annotate(
            "resource",
            $graph,
            '<'.$data["url"].'>',
            $data["id"],
            $data["start"],
            $data["end"],
            '<'.$exp[0].'>',
            "fabio:hasURL",
            '<'.$data["val"].'>',
            "L'url del documento è: ".$data["val"],
            $data["val"],
            $data["name"],
            $data["mail"]);
    }
// echo $store->insertIntoDefault($graph);
 echo "NoteCaricate";

?>
