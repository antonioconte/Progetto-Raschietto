<?php

require_once '../libraries/easyrdf-0.9.0/lib/EasyRdf.php';
require_once '../note_editors/RDFns.php';
require_once 'classArticle.php';
require_once '../note_editors/annotate.php';


class AlmaJournal extends Article{

		private function setTitle(){
			$this->title=$this->xpath->query($this->baseXPath."div[2]/h3")->item(0)->nodeValue;
			$path = $this->xpath->query($this->baseXPath."div[2]/h3")->item(0)->getNodePath();
			$titolo = $this->title;

			annotate(
				"literal",
				$this->graph,
				'<'.$this->url.'>',
				PathToID($path),
				0,
				strlen($this->title),
				'<'.$this->url.'>',
				"dcterms:title",
				$titolo,
				"Il titolo dell'articolo è: ".$titolo,
				NULL,
				$this->name,
				$this->mail);

		}

    private function setAuthors(){

		$this->authors = $this->xpath->query($this->baseXPath."div[3]/em")->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath."div[3]/em")->item(0)->getNodePath();


			$name = $this->authors;
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
				$this->authors,
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
				$this->authors,
				NULL,
				NULL,
				$this->name,
				$this->mail);
			annotate(
				"resource",
				$this->graph,
				'<'.$this->url.'>',
				PathToID($path),
				0,
				strlen($this->authors),
				'<'.$this->expression.'>',
				"dcterms:creator",
				$name,
				"Un autore del documento è ".$this->authors,
				$this->authors,
				$this->name,
				$this->mail);

	}


	private function setDoi(){
		$this->doi=$this->xpath->query($this->baseXPath."a[1]")->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath."a[1]")->item(0)->getNodePath();;

		annotate(
			"literal",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			0,
			strlen($this->doi),
			'<'.$this->expression.'>',
			"prism:doi",
			$this->doi,
			"Il DOI del documento è: ".$this->doi,
			NULL,
			$this->name,
			$this->mail);
	}

	private function setRhetoric(){
		$this->abstract=$this->xpath->query($this->baseXPath."div[4]/div[1]")->item(0)->nodeValue;
		$path = $this->xpath->query($this->baseXPath."div[4]/div[1]")->item(0)->getNodePath();;
		$obj = 'sro:Abstract';
		annotate(
			"resource",
			$this->graph,
			'<'.$this->url.'>',
			PathToID($path),
			0,
			strlen($this->abstract),
			'<'.PathToID($path).'>',
			"sem:denotes",
			$obj,
			"Questo frammento denota un(a) ".strtolower(substr($obj, 4)),
			substr($obj, 4),
			$this->name,
			$this->mail);
	}


	private function setYear(){

		$x =$this->xpath->query('/html/body/div/div[2]/div[2]/div[2]/a[2]')->item(0)->nodeValue;
		$x = explode("(",$x);

		if (strstr($this->url, "intreccidarte.unibo.it")) $start = strlen($x[0]);
		else 	$start = strlen($x[0]) + 1;
		$end = $start + 4;
		$y = explode(")",$x[1]);
		$path =$this->xpath->query('/html/body/div/div[2]/div[2]/div[2]/a[2]')->item(0)->getNodePath();

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


		private function setWorkExpr(){
			$this->work = substr($this->url, 0, strrpos($this->url, ".", -1));
			$this->expression = $this->work.'_ver1';
			annotate(
				"resource",
				$this->graph,
				'<'.$this->url.'>',
				NULL,
				NULL,
				NULL,
				'<'.$this->work.'>',
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
				'<'.$this->work.'>',
				"fabio:realization",
				'<'.$this->expression.'>',
				"A questo work è associata una expression",
				"Realization",
				$this->name,
				$this->mail);
		}

	function __construct($url){
		$this->graph = new EasyRdf_Graph();
		$this->url=$url;
		$this->dom = new DOMDocument();
		$this->dom->loadHTMLFile($url);
		$this->xpath = new DOMXpath($this->dom);
		$this->baseXPath = '/html/body/div/div[2]/div[2]/div[3]/';
		$this->setWorkExpr();
		$this->setTitle();
		$this->setAuthors();
		$this->setDoi();
		$this->setRhetoric();
  	$this->setYear();
		$this->graph->resource('sro:Abstract', 'skos:Concept');
		}

}


?>
