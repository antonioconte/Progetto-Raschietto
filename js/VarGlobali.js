/*VARIABILI GLOBALI */
var modeVE = "Viewer";
var numero_note;
var titolo;
var url_global;
var  authorforCites = [];
var modalVisible = false;
var currentArticle,
	currentArticleID,
	currentExpression;
var numArticles = 0;
var oldRes = {},
    newRes = {},
    arrayOldRes = [], // Contiene le note di ltw1515, così come sono state caricate dal triplestore
    arrayNewRes = []; // Contiene le note di ltw1515, al netto delle modifiche locali
    arrayOldResCited = []; // Contiene le note sugli articoli citati di ltw1515
    arrayNewResCited = []; // Contiene le note sugli articoli citati di ltw1515
    otherNotes = [];  // Contiene le note degli altri gruppi
// Mappa tra l'id dell'articolo e e l'array delle annotazioni locali, servirà per spedire i campi modificati
var loadedArticles = [];
var loadedAuthors = [];
var loadedGroups = [];
// var numNoteCorrenti = [];
//variabili per la creazione della nota
var label;
var typeNote;
var noteLocali = [];
var numeroNoteLocali = 9999;
var name, mail;

var ann_types = {
	'hasAuthor' : {
		'label' : 'Autore',
		'uri' : 'http://purl.org/dc/terms/creator'
	},
	'hasPublicationYear' : {
		'label' : 'Anno di pubblicazione',
		'uri' : 'http://purl.org/spar/fabio/hasPublicationYear'
	},
	'hasTitle' : {
		'label' : 'Titolo',
		'uri' : 'http://purl.org/dc/terms/title'
	},
	'hasDOI' : {
		'label' : 'DOI',
		'uri' : 'http://prismstandard.org/namespaces/basic/2.0/doi'
	},
	'hasURL' : {
		'label' : 'URL',
		'uri' : 'http://purl.org/spar/fabio/hasURL'
	},
	'hasComment' : {
		'label' : 'Commento',
		'uri' : 'http://schema.org/comment'
	},
	'denotesRhetoric' : {
		'label' : 'Retorica',
		'uri' : 'http://semanticweb.cs.vu.nl/2009/11/sem/denotes',
		'type' : [{
			'label' : 'Abstract',
			'uri' : 'http://salt.semanticauthoring.org/ontologies/sro#Abstract',
		}, {
			'label' : 'Introduction',
			'uri' : 'http://purl.org/spar/deo/Introduction',
		}, {
			'label' : 'Materials',
			'uri' : 'http://purl.org/spar/deo/Materials',
		}, {
			'label' : 'Methods',
			'uri' : 'http://purl.org/spar/deo/Methods',
		}, {
			'label' : 'Results',
			'uri' : 'http://purl.org/spar/deo/Results',
		}, {
			'label' : 'Discussion',
			'uri' : 'http://salt.semanticauthoring.org/ontologies/sro#Discussion',
		}, {
			'label' : 'Conclusion',
			'uri' : 'http://salt.semanticauthoring.org/ontologies/sro#Conclusion',
		}]
	},
	'cites' : {
		'label' : 'Citazione',
		'uri' : 'http://purl.org/net/cito/cites'
	}
};

/***************************/
