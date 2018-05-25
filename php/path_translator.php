<?php

header('Content-Type: application/json');

require_once 'scrapers/classArticle.php';

// 
// $test = 'form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/h3[1]';
// echo 'Test: '.$test.'<br/>';
// $fragtest = $a->XPathTofragID($test);
// echo 'Fragment: '.$fragtest.'<br/>';
// echo 'Test: '.$a->fragIDToXPath($fragtest).'<br/>'.($a->XPathTofragID($fragtest) == $test ? 1 : 0);
$str = $_GET['str'];
$out = $_GET['out'];
if ($out == 'id'){
	$str = PathToID($str);
} else {
	$str = IDtoPath($str);
}
echo json_encode($str, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

?>
