// jQuery Document
$(document).ready(function() {
    // Do some initial setup
    pointHistoryUpdate();

/*
    function fillProfile() {



    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
        document.getElementById("username").innerHTML = myObj[0].username;
        document.getElementById("city").innerHTML = myObj[0].city;
        document.getElementById("country").innerHTML = myObj[0].country;
        document.getElementById("email").innerHTML = myObj[0].email;
        var img = document.createElement('img');
        var src = document.createTextNode(myObj[0].image);
        img.appendChild(src);
        img.src = myObj[0].image;     
        $("#profile-img").append(img);
        document.getElementById("totalPoints").innerHTML = myObj[0].totalPoints;
    }
};
xmlhttp.open("GET", "/api/users/profile/58dc4850314bbd367a37a0f4", true);
xmlhttp.send();

    }
*/
//Update Point History - not done this yet.
    function pointHistoryUpdate() {
        $.ajax({
            type : "GET",
            url : "/api/users/pointhistory",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#pointstbl td").remove();
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var gameid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    $.each(this, function(k , v) {
                        if (k == "gameID") {
                            //capture the game ID for this row
                            if (v == null) {
                                gameid = null;
                            }
                            else {
                            gameid = v.toString();
                            }
                        }
                        else if (k == "activityType") {
                            //game name and make clickable
                            if (gameid == null) {
                                tcell3 = document.createTextNode(v.toString());
                            }
                            else {
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(v.toString());
                            a.appendChild(linkText);
                            a.title = v.toString();
                            a.href = "/game_checkpoints?gameid=" + gameid;
                            tcell3 = document.body.appendChild(a);
                            }
                    }
                        else if (k == "date") {
                            //var cell3 = tbl_row.insertCell();
                            tcell1 = document.createTextNode(v.toString());
                       }
                        else if (k == "points") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(v.toString());;
                    }

                    })        
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                })

                $("#pointstbl").append(tbl_body);

            }
        });
    }
            
            

    function linkToUpdateAccount() {
        var id = req.user; 
        var link = "/updateAccount/?id=" + id;
        document.getElementById("updateAcctLink").setAttribute("href", link);
   } 
    
});