$(document).ready(function() {
	$(document).on('click', ".open-modal-block", function() {
		var gruppo = $(this).attr("gruppo");
		$(".modal-" + gruppo).modal();
	});

	$(document).on('click', ".checkGruppo", function() {
		var gruppo = $(this).attr("value");
		if ($(this).attr("check") == 1) {
			//rimozione delle note del gruppo selezionato
			$(".highlight." + gruppo).removeClass("highlight");
			$(".modal-" + gruppo).remove();
//			$("i[gruppo='" + gruppo + "']").hide();
			$(this).attr("check", 0);
		} else {
			// var item = '<i gruppo="' + gruppo + '" href="#" class="open-modal-block fa fa-plus-circle fa-lg"></i>';
			// $(".groupMemberList." + gruppo).append(item);
			//caricamento delle note del gruppo selezionato
				$("i[gruppo='" + gruppo + "']").show();
			$(".alert-info").show("500");
			$(this).attr("check", 1);
			load_other_note(currentArticle, gruppo);

		}

	});
});
