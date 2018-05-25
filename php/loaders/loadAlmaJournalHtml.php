<?php

header('Content-Type: application/json');

$montesquieu = "montesquieu.unibo.it";
$intrecci = "intreccidarte.unibo.it";

$url = $_GET['url'];
$dom = new DOMDocument();
$dom->loadHTMLFile($url);
$xpath = new DOMXPath($dom);
$baseXPath = '/html/body/div/div[2]/div[2]/div[3]/';
if (strstr($url, $montesquieu)) $html[] = "<h2>Montesquieu</h2> (".$url.")";
else $html[]="<h2>Intrecci D'arte</h2> (".$url.")";

//Anno di pubblicazione
$pubblicationYear = $xpath->query('/html/body/div/div[2]/div[2]/div[2]/a[2]')->item(0)->nodeValue;
$path = $xpath->query('/html/body/div/div[2]/div[2]/div[2]/a[2]')->item(0)->getNodePath();
$html[] ="<p id='".XPathTofragID($path)."'>".$pubblicationYear."</p>";


//Titolo
$pathRelativo = "div[2]/h3";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$title=$xpath->query($baseXPath."div[2]")->item(0);
$html[] = $dom->saveHTML($title);

//DOI
$pathRelativo = "a[1]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$doi= $xpath->query($baseXPath."a[1]")->item(0);
$html[] = "<br><span>DOI: </span>".$dom->saveHTML($doi);

//Autori
$pathRelativo = "div[3]/em";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$author=$xpath->query($baseXPath."div[3]")->item(0);
$html[] = $dom->saveHTML($author);


//Abstract (montesquieu ha solo Abstract)
$pathRelativo = "div[4]/div[1]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$abstract=$xpath->query($baseXPath."div[4]")->item(0);
$html[] = $dom->saveHTML($abstract);

//KeyWords
$pathRelativo = "div[5]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$key=$xpath->query($baseXPath."div[5]")->item(0);
$html[] = $dom->saveHTML($key);

//FullDOC
$pathRelativo = "div[6]";
$path = $xpath->query($baseXPath.$pathRelativo)->item(0)->getNodePath();
$hrefs = $xpath->evaluate($baseXPath.$pathRelativo);
$href = $hrefs->item(0);
$href->setAttribute("id", XPathTofragID($path));
$full=$xpath->query($baseXPath."div[6]")->item(0);
$html[] = $dom->saveHTML($full);

$i = 0;
while($i<count($html)){
  $var = $var.$html[$i];
  $i++;
}
//echo $var;
  echo json_encode(array($var), JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

?>
