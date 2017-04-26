// jQuery Document
$(document).ready(function() {
    // Do some initial setup
    displayScoreboard();

//Register event handlers
$("#button1").click(function() {
    $('#button1').addClass('btn-primary');
    $('#button1').removeClass('btn-default');
    $('#button2').removeClass('btn-primary');
    $('#button2').addClass('btn-default');
    $('#button3').removeClass('btn-primary');
    $('#button3').addClass('btn-default');
    displayScoreboard();
});

$("#button2").click(function() {
    $('#button2').addClass('btn-primary');
    $('#button2').removeClass('btn-default');
    $('#button1').removeClass('btn-primary');
    $('#button1').addClass('btn-default');
    $('#button3').removeClass('btn-primary');
    $('#button3').addClass('btn-default');
    countryScoreboard();
});

$("#button3").click(function() {
    $('#button3').addClass('btn-primary');
    $('#button3').removeClass('btn-default');
    $('#button2').removeClass('btn-primary');
    $('#button2').addClass('btn-default');
    $('#button1').removeClass('btn-primary');
    $('#button1').addClass('btn-default');
    cityScoreboard();
});

       //GET scoreboard collection
    function displayScoreboard() {
        $.ajax({
            type : "GET",
            url : "/api/users/scoreboard",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#scoreboardtbl td").remove();
                var rank = 1;
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var userid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    var tcell0;
                    $.each(this, function(k , v) {
                        if (k == "_id") {
                            //capture the user ID for this row
                            userid = v.toString();
                            tcell0 = document.createTextNode(rank);
                            rank++;
                         }
                        else {
                            $.each(this, function(l , x) {
                        if (l == "username") {
                            //user name and make clickable
                            //var cell1 = tbl_row.insertCell();
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(x.toString());
                            a.appendChild(linkText);
                            a.title = x.toString();
                            a.href = "/profile/" + userid;
                            tcell1 = document.body.appendChild(a);
                    }
                        else if (l == "city") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(x.toString());
                       }
                        else if (l == "country") {
                            //var cell3 = tbl_row.insertCell();
                            tcell3 = document.createTextNode(x.toString());;
                    }
                        else if (l == "totalPoints") {
                            //var cell4 = tbl_row.insertCell();
                            tcell4 = document.createTextNode(x.toString());;
                       }
                                                   })
                        }
                    })        
                    tbl_row.insertCell().appendChild(tcell0);
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                    tbl_row.insertCell().appendChild(tcell4);
                })

                $("#scoreboardtbl").append(tbl_body);

            }
        });
    }

       //GET country scoreboard
    function countryScoreboard() {
        $.ajax({
            type : "GET",
            url : "/api/users/scoreboard?country=true",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#scoreboardtbl td").remove();
                var rank = 1;
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var userid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    var tcell0;
                    $.each(this, function(k , v) {
                        if (k == "_id") {
                            //capture the user ID for this row
                            userid = v.toString();
                            tcell0 = document.createTextNode(rank);
                            rank++;
                         }
                        else {
                            $.each(this, function(l , x) {
                        if (l == "username") {
                            //user name and make clickable
                            //var cell1 = tbl_row.insertCell();
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(x.toString());
                            a.appendChild(linkText);
                            a.title = x.toString();
                            a.href = "/profile/" + userid;
                            tcell1 = document.body.appendChild(a);
                    }
                        else if (l == "city") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(x.toString());
                       }
                        else if (l == "country") {
                            //var cell3 = tbl_row.insertCell();
                            tcell3 = document.createTextNode(x.toString());;
                    }
                        else if (l == "totalPoints") {
                            //var cell4 = tbl_row.insertCell();
                            tcell4 = document.createTextNode(x.toString());;
                       }
                                                   })
                        }
                    })        
                    tbl_row.insertCell().appendChild(tcell0);
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                    tbl_row.insertCell().appendChild(tcell4);
                })

                $("#scoreboardtbl").append(tbl_body);

            }
        });
    }
            
   

       //GET city scoreboard 
    function cityScoreboard() {
        $.ajax({
            type : "GET",
            url : "/api/users/scoreboard?city=true",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: function ( data ) {     
                //found some of this on http://stackoverflow.com/questions/1051061/convert-json-array-to-an-html-table-in-jquery
                var tbl_body = document.createElement("tbody");
                $("#scoreboardtbl td").remove();
                var rank = 1;
                $.each(data, function() {
                    var tbl_row = tbl_body.insertRow();
                    var userid;
                    var tcell1;
                    var tcell2;
                    var tcell3;
                    var tcell4;
                    var tcell0;
                    $.each(this, function(k , v) {
                        if (k == "_id") {
                            //capture the user ID for this row
                            userid = v.toString();
                            tcell0 = document.createTextNode(rank);
                            rank++;
                         }
                        else {
                            $.each(this, function(l , x) {
                        if (l == "username") {
                            //user name and make clickable
                            //var cell1 = tbl_row.insertCell();
                            var a = document.createElement('a');
                            var linkText = document.createTextNode(x.toString());
                            a.appendChild(linkText);
                            a.title = x.toString();
                            a.href = "/profile/" + userid;
                            tcell1 = document.body.appendChild(a);
                    }
                        else if (l == "city") {
                            //var cell3 = tbl_row.insertCell();
                            tcell2 = document.createTextNode(x.toString());
                       }
                        else if (l == "country") {
                            //var cell3 = tbl_row.insertCell();
                            tcell3 = document.createTextNode(x.toString());;
                    }
                        else if (l == "totalPoints") {
                            //var cell4 = tbl_row.insertCell();
                            tcell4 = document.createTextNode(x.toString());;
                       }
                                                   })
                        }
                    })        
                    tbl_row.insertCell().appendChild(tcell0);
                    tbl_row.insertCell().appendChild(tcell1);
                    tbl_row.insertCell().appendChild(tcell2);
                    tbl_row.insertCell().appendChild(tcell3);
                    tbl_row.insertCell().appendChild(tcell4);
                })

                $("#scoreboardtbl").append(tbl_body);

            }
        });
    }


});