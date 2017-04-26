// jQuery Document

$(document).ready(function() {
    // Do some initial setup
    gamesPlaying();
	gamesHosting();
  

       //GET all active games you're playing
    function gamesPlaying() {
        $.ajax({
            type : "GET",
            url : "/api/users/gamesplaying",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#gamesplay td").remove();
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var gameid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    $.each(this, function(k , v) {
                        if (k == "_id") {
                            //capture the game ID for this row
                            gameid = v.toString();
                        }
                        else if (k == "gameName") {
                            //game name and make clickable
                            //var cell1 = tbl_row.insertCell();
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(v.toString());
                            a.appendChild(linkText);
                            a.title = v.toString();
                            a.href = "/game_checkpoints?gameid=" + gameid;
                            tcell1 = document.body.appendChild(a);
                    }
                        else if (k == "gameDifficulty") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(v.toString());
                       }
                        else if (k == "gameCity") {
                            //var cell3 = tbl_row.insertCell();
                            tcell3 = document.createTextNode(v.toString());;
                    }
                        else if (k == "gameCountry") {
                            //var cell4 = tbl_row.insertCell();
                            tcell4 = document.createTextNode(v.toString());;
                       }
                    })        
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                    tbl_row.insertCell().appendChild(tcell4);
                })

                $("#gamesplay").append(tbl_body);

            }
        });
    }

       //GET all active games you're hosting
    function gamesHosting() {
        $.ajax({
            type : "GET",
            url : "/api/users/gameshosting",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#gameshost td").remove();
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var gameid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    $.each(this, function(k , v) {
                        if (k == "_id") {
                            //capture the game ID for this row
                            gameid = v.toString();
                        }
                        else if (k == "gameName") {
                            //game name and make clickable
                            //var cell1 = tbl_row.insertCell();
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(v.toString());
                            a.appendChild(linkText);
                            a.title = v.toString();
                            a.href = "/game_checkpoints?gameid=" + gameid;
                            tcell1 = document.body.appendChild(a);
                    }
                        else if (k == "gameDifficulty") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(v.toString());
                       }
                        else if (k == "gameCity") {
                            //var cell3 = tbl_row.insertCell();
                            tcell3 = document.createTextNode(v.toString());;
                    }
                        else if (k == "gameCountry") {
                            //var cell4 = tbl_row.insertCell();
                            tcell4 = document.createTextNode(v.toString());;
                       }
                    })        
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                    tbl_row.insertCell().appendChild(tcell4);
                })

                $("#gameshost").append(tbl_body);

            }
        });
    }

});
