<?php

header('Content-Type: application/json');

// Crea un'URI per l'autore, secondo lo standard del progetto
// @name: nome esteso dell'autore
// @bool: true-> per lo scraper, false -> per js
function createAuthor($name, $bool) {
	// Sostituisco il nome (esclusa la prima lettara), con "-"
	$name = substr_replace($name, '-', 1, strpos($name, ' '));
	// Elimino gli spazi
	$name = str_replace(' ', '', $name);
	// Converto in minuscolo e aggiungo il prefisso
	$name = 'http://vitali.web.cs.unibo.it/raschietto/person/' . strtolower($name);
	if ($bool){
		return $name;	
	} else {
		echo json_encode($name, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
	}
}

if (isset($_GET['name'])){
	createAuthor($_GET['name'], false);
}

?>