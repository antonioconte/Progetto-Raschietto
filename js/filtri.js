// Attiva o disattiva la visualizzazione di un target
// mode = 'show' | 'hide'
function viewHighlight(mode, selector){
	var list = $(selector);
	if (mode == 'hide'){
		list.each(function(){
			var className;
			if ($(this).hasClass('hasAuthor')){
				className = 'hasAuthor';
			} else if ($(this).hasClass('hasTitle')){
				className = 'hasTitle';
			} else if ($(this).hasClass('hasPublicationYear')){
				className = 'hasPublicationYear';
			} else if ($(this).hasClass('hasDOI')){
				className = 'hasDOI';
			} else if ($(this).hasClass('hasComment')){
				className = 'hasComment';
			} else if ($(this).hasClass('denotesRhetoric')){
				className = 'denotesRhetoric';
			} else if ($(this).hasClass('hasURL')){
				className = 'hasURL';
			} else if ($(this).hasClass('cites')){
				className = 'cites';
			}	
			// Tolgo l'ultimo carattere del nome della classe
			$(this).removeClass(className);
			$(this).addClass(className.substr(0, className.length-1));
		});
	} else if (mode == 'show'){
		list.each(function(){
			var className;
			if ($(this).hasClass('hasAutho')){
				className = 'hasAuthor';
			} else if ($(this).hasClass('hasTitl')){
				className = 'hasTitle';
			} else if ($(this).hasClass('hasPublicationYea')){
				className = 'hasPublicationYear';
			} else if ($(this).hasClass('hasDO')){
				className = 'hasDOI';
			} else if ($(this).hasClass('hasCommen')){
				className = 'hasComment';
			} else if ($(this).hasClass('denotesRhetori')){
				className = 'denotesRhetoric';
			} else if ($(this).hasClass('hasUR')){
				className = 'hasURL';
			} else if ($(this).hasClass('cite')){
				className = 'cites';
			}	
			// Aggiungo l'ultimo carattere del nome della classe
			$(this).removeClass(className.substr(0, className.length-1));
			$(this).addClass(className);
		});
	}
}

$(document).ready(function() {
	$(".flipswitch > input").click(function() {
		var id = $(this).attr("id");
		if ($(this).val() == 0) {
			if (id == "filtroAutore") {
				viewHighlight('hide', '.hasAuthor');
			} else if (id == "filtroTitolo") {
				viewHighlight('hide', '.hasTitle');
			} else if (id == "filtroAnno") {
				viewHighlight('hide', '.hasPublicationYear');
			} else if (id == "filtroDOI") {
				viewHighlight('hide', '.hasDOI');
			} else if (id == "filtroCommento") {
				viewHighlight('hide', '.hasComment');
			} else if (id == "filtroRetorica") {
				viewHighlight('hide', '.denotesRhetoric');
			} else if (id == "filtroURL") {
				viewHighlight('hide', '.hasURL');
			} else if (id == "filtroCitazione") {
				viewHighlight('hide', '.cites');
			}
			$(this).val(1);
		} else {
			if (id == "filtroAutore") {
				viewHighlight('show', '.hasAutho');
			} else if (id == "filtroTitolo") {
				viewHighlight('show', '.hasTitl');
			} else if (id == "filtroAnno") {
				viewHighlight('show', '.hasPublicationYea');
			} else if (id == "filtroDOI") {
				viewHighlight('show', '.hasDO');
			} else if (id == "filtroCommento") {
				viewHighlight('show', '.hasCommen');
			} else if (id == "filtroRetorica") {
				viewHighlight('show', '.denotesRhetori');
			} else if (id == "filtroURL") {
				viewHighlight('show', '.hasUR');
			} else if (id == "filtroCitazione") {
				viewHighlight('show', '.cite');
			}
			$(this).val(0);
		}
	});
});