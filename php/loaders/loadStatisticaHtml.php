<?php

header('Content-Type: application/json');

$url = $_GET['url'];
$dom = new DOMDocument();
$dom->loadHTMLFile("$url");
$xpath = new DOMXPath($dom);
$baseXPath = '/html/body/div[1]/div[2]/div[2]/div[3]/';

//InfoDOc
$html[] = "<h2>Statistica</h2> (".$url.")";

$pubblicationYear = $xpath->query("/html/body/div[1]/div[2]/div[2]/div[2]/a[2]")->item(0)->nodeValue;
$path = $xpath->query("/html/body/div[1]/div[2]/div[2]/div[2]/a[2]")->item(0)->getNodePath();
$html[] ="<p id='".XPathTofragID($path)."'>".$pubblicationYear."</p>";

// DOI
$pathRelativo = "a[1]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$doi= $xpath->query($baseXPath.$pathRelativo)->item(0);
$html[] = "<br><span>DOI: </span>".$dom->saveHTML($doi);

//Titolo
$pathRelativo = "div[2]/h3";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$title=$xpath->query($baseXPath.$pathRelativo)->item(0);
$html[] = $dom->saveHTML($title);


// //Autori
$pathRelativo = "div[3]/em";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$author=$xpath->query($baseXPath.$pathRelativo)->item(0);
$html[] = $dom->saveHTML($author);




// Abstract
$pathRelativo = "div[4]/div[1]/p[1]";
if(count($xpath->query($baseXPath.$pathRelativo)->item(0)) == 0) $pathRelativo = "div[4]/div[1]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$abstract=$xpath->query($baseXPath."div[4]")->item(0);
$html[] = $dom->saveHTML($abstract);


// CITAZIONI
$pathRelativo = "div[7]/div[1]/p";
$numCites = $xpath->query($baseXPath.$pathRelativo)->length;
$cites= $xpath->query($baseXPath.$pathRelativo);
for($i = 1; $i<$numCites+1; $i++){
  $path = $xpath->query($baseXPath.$pathRelativo."[".$i."]")->item(0)->getNodePath();
  $hrefs = $xpath->evaluate($baseXPath.$pathRelativo."[".$i."]");
  $href = $hrefs->item(0);
  $href->setAttribute("id", XPathTofragID($path));
  $xpath->query($baseXPath.$pathRelativo."[".$i."]")->item(0);
}
$citationHtml = $xpath->query($baseXPath."div[7]/div[1]")->item(0);
$html[] = $dom->saveHTML($citationHtml);
// echo $cites;


$i = 0;
while($i<count($html)){
  $var = $var.$html[$i];
  $i++;
}

//echo $var;
 echo json_encode(array($var), JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

?>
