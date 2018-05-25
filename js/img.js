$(document).ready(function(){
  $("#who").mouseup(function(){
  $(".chi_siamo").html("<h4>Componenti:</h4><div id='noi'><p>Conteduca Antonio</p><p>Mastromarino Francesco</p><p>Vainigli Lorenzo</p></div>");
     });

       $("#who").mouseleave(function(){
              $(".chi_siamo").html("");
       });
})
