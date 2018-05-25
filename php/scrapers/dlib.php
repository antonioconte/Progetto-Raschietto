<?php

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';
require_once 'classArticle.php';
require_once '../note_editors/annotate.php';
error_reporting(0);

class DLib extends Article{

	private function printDOMStructure(DOMNode &$p, $level=0){
		foreach ($p->childNodes as $node){
			for($i=0; $i<$level; $i++)
				echo "&nbsp&nbsp&nbsp";
			echo $node->nodeName." ".$node->nodeValue."   ". $node->getNodePath()."<br><br>";
			$this->printDOMStructure($node, $level+1);
		}
	}


	private function setTitle(){
		$this->title=$this->xpath->query($this->baseXPath.'/h3[2]')->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath.'/h3[2]')->item(0)->getNodePath();
		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			0,
			strlen($this->title),
			'<'.$this->url.'>',
			"dcterms:title",
			$this->title,
			"Il titolo del documento è ".$this->title,
			NULL,
			$this->name,
			$this->mail);
	}

	private function setAuthors(){
		$path=$this->xpath->query($this->baseXPath.'/p[2]')->item(0);
		$bodypath = DOMinnerHTML($path);
		$all_lines = array();
		$all_lines = preg_split('/\n/', $bodypath);
		$name_lines = array();
		for ($i=1; $i < count($all_lines)-2; $i=$i+4) {
			array_push($name_lines, $all_lines[$i]);
		}
		$list = array();
		for ($i=0; $i < count($name_lines); $i++) {
			preg_match_all("/((\p{Lu})\p{Ll}+\s)+((\p{Lu})\p{Ll}+)/u", $name_lines[$i], $local_list);
			foreach ($local_list[0] as $name) {
				array_push($list, $name);
			}
		}
		$bodypath = preg_replace('/\n\n/', '  ', strip_tags($bodypath));
		$path = $path->getNodePath();
		$i=0;
		while ($list[$i]!=NULL){
			$this->authors[$i]=$list[$i];
			// Crea un'URI per l'autore, secondo lo standard del progetto
			$name = $this->authors[$i];
			// Sostituisco il nome (esclusa la prima lettara), con "-"
			$name = substr_replace($name, '-', 1, strpos($name, ' '));
			// Elimino gli spazi
			$name = str_replace(' ', '', $name);
			// Converto in minuscolo e aggiungo il prefisso
			$name = 'rsch:'.strtolower($name);
			$start = strpos($bodypath, $this->authors[$i]);
			$end = strpos($bodypath, $this->authors[$i])+strlen($this->authors[$i]);
			// annotate(
				// "literal",
				// $this->graph,
				// $name,
				// NULL,
				// $start,
				// $end,
				// $name,
				// "rdf:type",
				// $this->authors[$i],
				// NULL,
				// NULL,
				// $this->name,
				// $this->mail);
			annotate(
				"resource",
				$this->graph,
				'<'.$this->url.'>',
				PathToID($path),
				$start,
				$end,
				'<'.$this->expression.'>',
				"dcterms:creator",
				$name,
				"Un autore del documento è ".$this->authors[$i],
				$this->authors[$i],
				$this->name,
				$this->mail);
			$i++;
		}
	}

	private function setDOI(){
		$this->doi=$this->xpath->query($this->baseXPath.'/p[2]')->item(0);
		$this->doi=DOMinnerHTML($this->doi);
		$path = $this->xpath->query($this->baseXPath.'/p[2]')->item(0)->getNodePath();
		// int strpos ( string $haystack , mixed $needle [, int $offset ] )
		$this->doi = strtolower(strip_tags($this->doi));
		$str_doi = null;
		if (stripos($this->doi, "doi: ")){
			$str_doi = "doi: ";
		} else {
			$str_doi = "doi:";
		}
		$start = stripos($this->doi, $str_doi);
		$length = strlen(substr($this->doi, $start));
		$this->doi = substr($this->doi, $start, $length-2);
		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			$start,
			$start+$length,
			'<'.$this->expression.'>',
			"prism:doi",
			$this->doi,
			"Il doi del documento è ".$this->doi,
			NULL,
			$this->name,
			$this->mail);
	}

	private function setPubblicationYear(){
		$this->year=$this->xpath->query($this->baseXPath.'/p[1]')->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath.'/p[1]')->item(0)->getNodePath();
		preg_match("/([0-9]{4})/", $this->year, $list);
		$start = stripos($this->year, $list[0]);
		$end = stripos($this->year, $list[0]) + strlen($list[0]);
		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			$start,
			$end,
			'<'.$this->expression.'>',
			"fabio:hasPublicationYear",
			$list[0],
			"L'anno di pubblicazione del documento è il ".$list[0],
			NULL,
			$this->name,
			$this->mail);
	}
	
	private function setWorkExpr($cited, $i, $url){
		if ($cited){
			if (strrpos($url, ".html")){
				$work = substr($url, 0, strrpos($url, ".html"));	
			} else {
				$work = $url;
			}
			$expression = $work.'_ver1_cited'.$i;
		} else {
			$work = $this->work;
			$expression = $this->expression;
		}
		$this->simplyAnnotate('<'.$expression.'>', 'a', 'fabio:Expression');
		$this->simplyAnnotate('<'.$expression.'>', 'fabio:hasRepresentation', '<'.$url.'>');
		$this->simplyAnnotate('<'.$work.'>', 'a', 'fabio:Work');
		$this->simplyAnnotate('<'.$work.'>', 'fabio:hasPortrayal', '<'.$url.'>');
		$this->simplyAnnotate('<'.$work.'>', 'frbr:realization', '<'.$expression.'>');
		return $expression;
	}

	private function setCites(){
		// Seleziono i paragrafi con le citazioni: sono i "p" che stanno tra "References" o "Works Cited" e "About the Author(s)"
		$results=$this->xpath->query($this->baseXPath.'/p[preceding-sibling::h3[text()="References" or text()="Works Cited"] and following-sibling::h3[text()="About the Authors" or text()="About the Author"]]');
		$i=0;
		// Per ogni documento citato
		foreach ($results as $item) {
			$path = $item->getNodePath();
			$end=strlen($item->textContent);
			// Per ogni nodo figlio
			foreach ($item->childNodes as $child) {
				// Per ogni attributo
				foreach ($child->attributes as $attr) {
					// Considero solo le citazioni con link
    				if ($attr->nodeName=="href"){
						$this->cites[$i] = $attr->nodeValue;
						$i++;
						$cited_expr = $this->setWorkExpr(true, $i, $attr->nodeValue);
						annotate(
							"resource",
							$this->graph,
							'<'.$this->url.'>',
							PathToID($path),
							0,
							$end,
							'<'.$this->expression.'>',
							"cito:cites",
							'<'.$cited_expr.'>',
							"Un documento citato è ".$child->nodeValue,
							$child->nodeValue,
							$this->name,
							$this->mail);
					}
  				}
			}
		}
	}

	private function setRhetoric(){
		$results=$this->xpath->query($this->baseXPath.'/h3[following-sibling::p] | '.$this->baseXPath.'/p[preceding-sibling::h3]');
		$i = 0;
		while ($i<$results->length-1) {
			$title=$results->item($i)->nodeValue;
			$i++;
			while ($results->item($i)->nodeName == 'p'){
				$path = $results->item($i)->getNodePath();
				$content = $results->item($i)->nodeValue;
				$end=strlen($results->item($i)->textContent);
				if (!(strpos($content, 'Keyword', 0)===0)){
					$obj = NULL;
					if (strstr($title, 'Abstract')){
						$obj = 'sro:Abstract';
					} else if (strstr($title, 'Introduction')){
						$obj = 'deo:Introduction';
					} else if (strstr($title, 'Material')){
						$obj = 'deo:Materials';
					} else if (strstr($title, 'Method')){
						$obj = 'deo:Methods';
					} else if (strstr($title, 'Result')){
						$obj = 'deo:Results';
					} else if (strstr($title, 'Discussion')){
						$obj = 'sro:Discussion';
					} else if (strstr($title, 'Conclusion')){
						$obj = 'sro:Conclusion';
					}
					if ($obj!=NULL){
						annotate(
							"resource",
							$this->graph,
							'<'.$this->url.'>',
							PathToID($path),
							0,
							$end,
							'<'.$this->url.'#'.PathToID($path).'>',
							"sem:denotes",
							$obj,
							"Questo frammento denota ".substr($obj, 4),
							substr($obj, 4),
							$this->name,
							$this->mail);
					}
				}
				$i++;
			}
		}
	}

	function __construct($url){
		$this->graph = new EasyRdf_Graph();
		$this->url=$url;
		$this->dom = new DOMDocument();
		$this->dom->loadHTMLFile($url);
		$this->xpath = new DOMXpath($this->dom);
		$this->baseXPath = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr[1]/td[2]';
		//var_dump($this->xpath->query($this->baseXPath));
		//$this->printDOMStructure($doc);
		$this->work = substr($this->url, 0, strrpos($this->url, "."));
		$this->expression = $this->work.'_ver1';
		$this->setWorkExpr(false, null, $this->url);
		$this->setTitle();
		$this->setAuthors();
		$this->setDOI();
		$this->setPubblicationYear();
		$this->setCites();
		$this->setRhetoric();
		$this->simplyAnnotate('sro:Abstract', 'a', 'skos:Concept');
		$this->simplyAnnotate('deo:Introduction', 'a', 'skos:Concept');
		$this->simplyAnnotate('deo:Materials', 'a', 'skos:Concept');
		$this->simplyAnnotate('deo:Methods', 'a', 'skos:Concept');
		$this->simplyAnnotate('deo:Results', 'a', 'skos:Concept');
		$this->simplyAnnotate('sro:Discussion', 'a', 'skos:Concept');
		$this->simplyAnnotate('sro:Conclusion', 'a', 'skos:Concept');
	}

}

?>
