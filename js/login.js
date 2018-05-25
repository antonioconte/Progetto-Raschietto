$(document).ready(function(){

  $(".otherMode").click(function(){
    if(modeVE == "Viewer"){
      //Compare il modal del login
      $("#modal_login").modal();
    }
    else{
      //entra in mode Viewer
      $(".viewer-editor").html('<li><i class="fa fa-child fa-lg"></i> Viewer <span class="caret"></li>')
      $(".otherMode").html('<li><a><i class="fa fa-pencil-square-o fa-lg"></i> Annotator </a></li>')
      //Cambia sfondo
      $("#corpo").removeClass("corpoe");
      $("#corpo").addClass("corpov");

      //Nasconde il pulsate del modal_widget
      $(document).find(".edit").hide();
	     $("#doc_info").hide();
		  $("#createNote").hide();
      $("#bar").removeClass("navbar-inverse");
      $("#bar").addClass("navbar-default");
      $(document).find(".fa-times").hide();
      modeVE = "Viewer";
    }
  })
})

function enter(){
  name = $("#inputNomeLogin").val();
  mail = $("#inputEmailLogin").val();
  if(name == "" || mail == "") {
    alert_login();
    return;
  }
  //entra in mode editor
  $("#nome-annotatore").html(name );
  $(".viewer-editor").html('<li><i class="fa fa-pencil-square-o fa-lg"></i> Annotator<span class="caret"></li>')
  $(".otherMode").html('<li><a><i class="fa fa-child fa-lg"></i> Viewer </a></li>')
  //Cambia sfondo
  $("#corpo").removeClass("corpov");
  $("#corpo").addClass("corpoe");
  $("#bar").removeClass("navbar-default");
  $("#doc_info").show();
		$("#createNote").show();
  $("#bar").addClass("navbar-inverse");
  //Mostra il pulsate del modal_widget
  $(document).find(".edit").show();
  $(document).find(".fa-times").show();


  modeVE = "Editor";
}
