$(function(){
  $("#resultado").hide();

  $("#sendRequest").click(function(){
    $("#formulario").hide();
    $("#resultado").show();
    $("#showResultado").hide();
    $(".loader").show();

    var summoner = $("#summonerInput").val();
    var host = $("#hostSelect").val();
    var accId = "";
    var matchList = [];
    var deathsTotal = 0;

    $.ajax({
      method: "GET",
      url: "http://localhost:8000/getSummonerId?",
      async: false,
      data:{summoner : summoner, host : host} ,
      beforesend : function(){
        console.log("mandando consulta");
      },
      success: function(respuesta){
        accId += respuesta.accountId;

      },
      error: function(){
        console.log("no se ha podido obtener la info");
      }
    });
    $.ajax({
      method: "GET",
      url: "http://localhost:8000/getMatchesList?",
      async: false,
      data:{accId : accId, host : host} ,
      beforesend : function(){
        console.log("mandando consulta");
      },
      success: function(respuesta){
        respuesta.forEach((match, i) => {
          matchList.push(respuesta[i]);
        });
      },
      error: function(){
        console.log("no se ha podido obtener la info");
      }
    });
    for (var i = 0; i < matchList.length; i++) {
      var matchKey = matchList[i];
      $.ajax({
        method: "GET",
        url: "http://localhost:8000/getMatchDeath?",
        async: false,
        data:{gameId : matchKey, host : host, summoner: summoner} ,
        beforesend : function(){
          console.log("mandando consulta");
        },
        success: function(respuesta){
          deathsTotal += respuesta[0];
        },
        error: function(){
          console.log("no se ha podido obtener la info");
        }
      });
    };

    $("#showResultado").text(deathsTotal + " MUERTES");
    $(".loader").hide();
    $("#showResultado").show();
  });

  $("#retryRequest").click(function(){
    $("#resultado").fadeOut();
    $("#formulario").fadeIn();
  });
});
