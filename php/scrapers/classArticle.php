<?php

require_once __DIR__ . '/../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once __DIR__ . '/../note_editors/RDFns.php';


class Article {

	protected $title, $authors, $doi, $year, $cites, $url, $xpath, $baseXPath, $html, $dom, $name = "Script And Furious", $mail = "ltw1515@studio.unibo.it";
	public $graph, $expression, $work;


	protected function simplyAnnotate($s,$p,$o) {
		$store = new EasyRdf_Sparql_Client("http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1515?pass=ghKK08=Xa");
		$query = $prefixes . '
		INSERT DATA {
	  		GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1515>
	  		{' . $s . ' ' . $p . ' ' . $o . '}
	  	}';
		$res = $store -> update($query);
	}
	
	protected function createID($string) {
		$before = array('/', '@', '[', ']', '*', '=', '"');
		$after = array('', '', '', '_', '', '_');
		return str_replace($before, $after, $string);
	}

	private function fragIDToXPath($nodepath) {
		$nodepath = str_replace('_', '/', $nodepath);
		// Metto i numeri tra parentesi quadre
		$pattern = array('/([?!h])([0-9])([0-9])+/', '/(?!h)([^\[])([0-9])+([^\]])/');
		$replace = array('$1$2[$3]', '$1[$2]$3');
		$nodepath = preg_replace($pattern, $replace, $nodepath);
		return $nodepath;
	}

	private function XPathTofragID($nodepath) {
		$nodepath = str_replace(array('/html', '/body/', '[', ']', '/'), array('', '', '', '', '_'), $nodepath);
		// Mette un 1 dove c'è un elemento senza numero
		// $0 fa riferimento a tuttI i match
		// $i fa riferimento all'i-esimo match, cioè riferito al pattern tra le i-esime parentesi tonde
		$pattern = array('/([a-z]+)(?![0-9]+)(\_|$)/', '/(h([1-6])(?![0-9]+))/');
		$replace = array('${1}1${2}', '${0}1');
		$nodepath = preg_replace($pattern, $replace, $nodepath);
		return $nodepath;
	}

}

function IDtoPath($nodepath) {
	$nodepath = str_replace('_', '/', $nodepath);
	// Metto i numeri tra parentesi quadre
	$pattern = array('/([0-9])+/', '/(h)(\[)([0-9])([0-9]+)/');
	$replace = array('[$0]', '$1$3[$4');
	$nodepath = preg_replace($pattern, $replace, $nodepath);
	return $nodepath;
}

function PathToID($nodepath) {
	$nodepath = str_replace(array('/html', '/body/', '/tbody', '[', ']', '/'), array('', '', '', '', '', '_'), $nodepath);
	// Mette un 1 dove c'è un elemento senza numero
	// $0 fa riferimento a tuttI i match
	// $i fa riferimento all'i-esimo match, cioè riferito al pattern tra le i-esime parentesi tonde
	$pattern = array('/([a-z]+)(?![0-9]+)(\_|$)/', '/(h([1-6])(?![0-9]+))/');
	$replace = array('${1}1${2}', '${0}1');
	$nodepath = preg_replace($pattern, $replace, $nodepath);
	return $nodepath;
}

//http://stackoverflow.com/questions/2087103/how-to-get-innerhtml-of-domnode
function DOMinnerHTML(DOMNode $element) {
	$innerHTML = "";
	$children = $element -> childNodes;

	foreach ($children as $child) {
		$innerHTML .= $element -> ownerDocument -> saveHTML($child);
	}

	return $innerHTML;
}

/*$test = 'form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/p[34]';
 echo 'Test: '.$test.'<br/>';
 $fragtest = PathToID($test);
 echo 'Fragment: '.$fragtest.'<br/>';
 echo 'Test: '.IDToPath($fragtest).'<br/>';*/
?>
