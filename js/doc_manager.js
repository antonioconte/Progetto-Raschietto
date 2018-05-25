$(document).ready(function(){
	var loaded = [];
	//caricamento lista articoli screpabili
	$.ajax({
		type: "GET",
		url: "./js/docList.json",
		success: function(doclist){

			$.ajax({
				type : "GET",
				url : "./php/loaders/articoli.php",
				success : function(d) {
					for ( i = 0; i < d.length; i++) {
						loaded.push(d[i].url);
						//loadedArticles.push(d[i].title);
					}
					// data-dismiss="modal"
					//var gears_ico = '<button title="Ricarica Annotazioni" type="button" class="btn btn-default re-scrape"><i class="fa fa-cogs fa-2x"></i></button>';
					var gear_ico = '<button title="Raschia Documento" type="button" class="btn btn-default scrape"><i class="fa fa-cog fa-2x"></i></button>';
					//var bin_ico = '<button title="Elimina" type="button" class="btn btn-default delete-doc"><i class="fa fa-trash fa-2x"></i></button>';
					var bin_ico = "";
					var globe_ico = '<button title="Pagina Web" type="button" class="btn btn-default link"><i class="fa fa-globe fa-2x"></i></button>';
					var i = 1;
					$.each(doclist, function(key, val){
						var hided_url = '<span class="hided_url" style="display:none;">'+val.url+'</span>';
						if ($.inArray(val.url, loaded)>-1){
							var x = val.url;
							var title = '<a href="#" class="link">'+val.title+'</a>';
								var url_ico = '<a href="'+x+'"><button title="Pagina Web" type="button" class="btn btn-default"><i class="fa fa-globe fa-2x"></i></button></a>';
							$("#modal-docs .modal-body table").append('<tr><td>'+i+'</td><td>'+hided_url+title+'</td><td></td><td>'+url_ico+'</td></tr>');
						} else {
							var link = '<a href="'+val.url+'" target="_blank">'+globe_ico+'</a>';
							$("#modal-docs .modal-body table").append('<tr><td>'+i+'</td><td>'+hided_url+val.title+'</td><td>'+link+'</td><td>'+gear_ico+'</td></tr>');
						}
						i++;
					});
					$(".fakeloader").fadeOut();
				},
				error : function() {
					alert("errore nel caricamento (articoli.php)");
					$(".fakeloader").fadeOut();
				}
			});
		},
			error: function(){
				alert("error");
			}
});


	// Apre la modal dei documenti disponibili
	$(document).on('click', '#doc_list', function() {
		$('#modal-docs').modal();
	});

	// Chiude la modal dei documenti disponibili se è selezionata una azione
	$(document).on('click', '#modal-docs a', function() {
		$('#modal-docs').modal('hide');
	});

	// Raschia un documento
	$('#modal-docs').on('click', '.scrape', function() {
		var url = $(this).parents().eq(1).find('.hided_url').html();
		console.log(url);
		graph(url,null);
		$.ajax({
			type : "GET",
			url : "./php/scrapers/scrape.php?url="+url,
			success : function(d) {
				console.log("Documento caricato!");
			},
			error : function() {
				alert("Errore in fase di caricamento del documento!");
			}
		});
	});

	// Elimina un documento (cioè tutte le annotazioni ad esso relative)
	$('#modal-docs').on('click', '.delete-doc', function() {
		var url = $(this).parents().eq(1).find('.hided_url').html();
		console.log(url);
		$.ajax({
			type : "GET",
			url : "./php/note_editors/delete_doc.php?url="+url,
			success : function(d) {
				//alert("Documento eliminato!");
			},
			error : function() {
				alert("Errore in fase di eliminazione del documento!");
			}
		});
	});

	// Elimina un documento se presente e lo rianalizza
	$('#modal-docs').on('click', '.re-scrape', function() {

	});

$('#modal-docs').on('click', '.link', function() {
		var url = $(this).parent().find('span').eq(0).html();
		var num = $(this).parents().eq(1).find('td').eq(0).html();
		num = eval(parseInt(num)+1);
		console.log(url, num);
		graph(url,num);
	});
});
