<?php

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';
require_once 'classArticle.php';
require_once '../note_editors/annotate.php';

class Statistica extends Article{

	private function setTitle(){
		$this->title=$this->xpath->query($this->baseXPath."div[2]/h3")->item(0)->nodeValue;
		// echo $this->title;
		$path = $this->xpath->query($this->baseXPath."div[2]/h3")->item(0)->getNodePath();
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
			"Il Titolo del documento è: ".$this->title,
			NULL,
			$this->name,
			$this->mail);
	}

	private function setAuthors(){
			$this->authors = explode(",",$this->xpath->query($this->baseXPath."div[3]/em")->item(0)->nodeValue);
			/*Elimina eventuali spazi all'inizio di stringa autore*/
			for($i=0; $i<count($this->authors); $i++){
				$name = $this->authors[$i];
				if($name[0] == " ") $this->authors[$i] = substr($name, 1 );
			}
			$path = $this->xpath->query($this->baseXPath."div[3]/em")->item(0)->getNodePath();
			 $lProg = 0;
			 for($i=0; $i<count($this->authors); $i++){
				$name = $this->authors[$i];
				//Standard autore progetto
				$name = substr_replace($name, '-', 1, strpos($name, ' '));
				$name = str_replace(' ', '', $name);
				$name = 'rsch:'.strtolower($name);
				annotate(
					"literal",
					$this->graph,
					$name,
					NULL,
					NULL,
					NULL,
					$name,
					"rdf:type",
					$this->authors[$i],
					NULL,
					NULL,
					$this->name,
					$this->mail);
				annotate(
					"literal",
					$this->graph,
					$name,
					NULL,
					NULL,
					NULL,
					$name,
					"foaf:name",
					$this->authors[$i],
					NULL,
					NULL,
					$this->name,
					$this->mail);
				annotate(
					"resource",
					$this->graph,
					'<'.$this->url.'>',
					PathToID($path),
					$lProg,
					(strlen($this->authors[$i])+$lProg),
					'<'.$this->expression.'>',
					"dcterms:creator",
					$name,
					"Un autore del documento è ".$this->authors[$i],
					$this->authors[$i],
					$this->name,
					$this->mail);
					$lProg =$lProg +strlen($this->authors[$i])+ 2;

				}
		}

	private function setDoi(){
		$this->doi = $this->xpath->query($this->baseXPath."a[1]")->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath."a[1]")->item(0)->getNodePath();
		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			0,
			strlen($this->doi),
			'<'.$this->url.'>',
			"prism:doi",
			$this->doi,
			"Il DOI del documento é: ".$this->doi,
			NULL,
			$this->name,
			$this->mail);
	}

	private function setRetorica(){
			$pathRelativo = "div[4]/div[1]/p[1]";
			if(count($this->xpath->query($this->baseXPath.$pathRelativo)->item(0)) == 0) $pathRelativo = "div[4]/div[1]";
			$this->rethoric = $this->xpath->query($this->baseXPath.$pathRelativo)->item(0)->nodeValue;
			$path = $this->xpath->query($this->baseXPath.$pathRelativo)->item(0)->getNodePath();
			$obj = 'sro:Abstract';
			annotate(
				"resource",
				$this->graph,
				'<'.$this->url.'>',
				PathToID($path),
				0,
				strlen($this->rethoric),
				'<'.PathToID($path).'>',
				"sem:denotes",
				$obj,
				"Questo frammento denota un(a) ".strtolower(substr($obj, 4)),
				substr($obj, 4),
				$this->name,
				$this->mail);
	}

	private function setWorkExpr(){
		$this->work =  explode(".html",$this->url);
		$this->expression = $this->work[0].'_ver1';
		annotate(
			"resource",
			$this->graph,
			'<'.$this->url.'>',
			NULL,
			NULL,
			NULL,
			'<'.$this->work[0].'>',
			"fabio:hasPortrayal",
			'<'.$this->url.'>',
			"A questo work è associato un URL",
			"Portrayal",
			$this->name,
			$this->mail);
		annotate(
			"resource",
			$this->graph,
			'<'.$this->url.'>',
			NULL,
			NULL,
			NULL,
			'<'.$this->expression.'>',
			"fabio:hasRepresentation",
			'<'.$this->url.'>',
			"A questa expression è associato un URL",
			"Representation",
			$this->name,
			$this->mail);
		annotate(
			"resource",
			$this->graph,
			'<'.$this->url.'>',
			NULL,
			NULL,
			NULL,
			'<'.$this->work[0].'>',
			"fabio:realization",
			'<'.$this->expression.'>',
			"A questo work è associata una expression",
			"Realization",
			$this->name,
			$this->mail);
	}

	private function setYear(){
		$this->year = $this->xpath->query("/html/body/div[1]/div[2]/div[2]/div[2]/a[2]")->item(0)->nodeValue;
		$path = $this->xpath->query("/html/body/div[1]/div[2]/div[2]/div[2]/a[2]")->item(0)->getNodePath();
		$x = explode("(",$this->year);
		$start = strlen($x[0])+1;
		$end = $start + 4;
		$y = explode(")",$x[1]);

		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			$start,
			$end,
			'<'.$this->expression.'>',
			"fabio:hasPublicationYear",
			$y[0],
			"L'articolo è stato pubblicato nel: ".$y[0],
			NULL,
			$this->name,
			$this->mail);
	}

	function __construct($url){

    $this->graph = new EasyRdf_Graph();
		$this->url= $url;
		$this->dom = new DOMDocument();
		$this->dom->loadHTMLFile($url);
		$this->xpath = new DOMXpath($this->dom);
		$this->baseXPath =  '/html/body/div[1]/div[2]/div[2]/div[3]/';
		$this->setWorkExpr();
		$this->setTitle();
		$this->setAuthors();
		$this->setDoi();
		$this->setYear();
		$this->setRetorica();

	}
}


?>
