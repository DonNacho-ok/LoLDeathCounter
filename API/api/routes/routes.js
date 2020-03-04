const request = require("request");
var apikey ="RGAPI-903504a2-1e77-4e43-8a8f-f180a746fd29";

module.exports = function(app, api){
  app.get("/getSummonerId",function(req, res){
    var s_search = req.query.summoner;
    var serverhost = req.query.host;
    var URL = serverhost + "/lol/summoner/v4/summoners/by-name/" + s_search + "?api_key=" + apikey;
    var resJson = {};
    request(URL, function(err, response, body){
      if (!err && response.statusCode == 200) {
        resJson = JSON.parse(body);
      }else {
        console.log(err);
      }
    });
    function responseSender(){
        res.send(resJson);
    }
    setTimeout(responseSender, 1500);
  });

  app.get("/getMatchesList", function(req, res){
    var accID = req.query.accId;
    var serverhost = req.query.host;
    var URL2 = serverhost + "/lol/match/v4/matchlists/by-account/" + accID + "?endIndex=10&api_key=" + apikey;
    var matches = [];
    console.log(URL2);
    request(URL2, function(err, response, body){
      if (!err && response.statusCode == 200) {
        var json = JSON.parse(body);
        json.matches.forEach((match, i) => {
          matches.push(match.gameId);
        });

      }else {
        console.log(err);
      }
    });
    console.log(matches);
    function responseSender2(){
        res.send(matches);
    };
    setTimeout(responseSender2, 1500);
  });

  app.get("/getMatchDeath", function(req, res){
    var summoner = req.query.summoner;
    var serverhost = req.query.host;
    var matchId = req.query.gameId;
    var URL3 = serverhost + "/lol/match/v4/matches/" + matchId + "?api_key=" + apikey;
    var participanteID = 0;
    var death = [];

    console.log(URL3);

    request(URL3, function(err, response, body){
      if (!err && response.statusCode == 200) {
        var json = JSON.parse(body);
        json.participantIdentities.forEach((participante, i) => {
          if (participante.player.summonerName == summoner) {
            participanteID = participante.participantId;
          }
        });
        json.participants.forEach((participant, i) => {
          if(participant.participantId == participanteID){
            death.push(participant.stats.deaths);
          }
        });
      }else {
        console.log(err);
      }
    });
    function responseSender3(){
        res.send(death);
    };
    setTimeout(responseSender3, 1500);
  });
};
