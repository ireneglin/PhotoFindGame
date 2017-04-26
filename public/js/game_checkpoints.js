function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
}

var checkpointids = [];

var registered = false;

$.ajax({
        url: "/api/games/" + getQueryVariable('gameid'),
        type: "get",
        dataType: "json",
        success: function(game){
          if(game){
            $("#gamename").html(game[0].gameName);
            $("#gameplace").html(game[0].gameCity + ", " + game[0].gameCountry);
            $("#gamedescription").html(game[0].gameInfo);
          }
          $.ajax({
                  url: "/api/games/" + getQueryVariable('gameid') + "/checkpoints",
                  type: "get",
                  dataType: "json",
                  success: function(checkpoints){
                    var photosection = $("#checkpoints");
                    photosection.append("<h3>Checkpoints</h3>");
                    var i;
                    for(i=0;i<checkpoints.length;i++){
                      if(i%3 == 0){
                        photosection.append('<div id="photos_line_' + (1+Math.floor(i/3)).toString() + '" class="photos_line jumbotron"></div>');
                      }
                      $("#photos_line_" + (1+Math.floor(i/3)).toString()).append('<div class="photo jumbotron"><a class="link" href="#"><img src="' + checkpoints[i].checkpointImg + '" alt="Impossible to display the image"></a></div>');
                      checkpointids.push(checkpoints[i]._id);
                    }
                    $.ajax({
                            url: "/api/games/" + getQueryVariable('gameid') + '/ismanager',
                            type: "get",
                            dataType: 'json',
                            success: function(result){
                              
                              if(result.admin){
                                  $('#loading').toggleClass('not_hidden');
                                  $('#loading').toggleClass('hidden');
                                  $('#admin').toggleClass('hidden');
                                  $('#admin').toggleClass('not_hidden');
                                  $('#buttons').toggleClass('hidden');
                                  $('#buttons').toggleClass('not_hidden');
                                  var photos = $(".photos_line>div>a");
                                  var i;
                                  for(i=0;i<photos.length;i++){
                                    $(photos[i]).attr('href',"/unchecked_photos?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[i]);
                                  }
                              }else{
                                  $.ajax({
                                      url: "/api/users/gamesplayingbis",
                                      type: "get",
                                      dataType: "json",
                                      success: function(results){
                                        if(results.indexOf(getQueryVariable('gameid')) >= 0){
                                          registered = true;
                                          $('#loading').toggleClass('not_hidden');
                                          $('#loading').toggleClass('hidden');
                                          $('#progression').toggleClass('hidden');
                                          $('#progression').toggleClass('not_hidden');
                                          $('#buttons').toggleClass('hidden');
                                          $('#buttons').toggleClass('not_hidden');
                                  
                                        }
                                        else {
                                          $('#loading').toggleClass('not_hidden');
                                          $('#loading').toggleClass('hidden');
                                          $('#not_registered').toggleClass('not_hidden');
                                          $('#not_registered').toggleClass('hidden');
                                        }
                                          var j;
                                          var photos = $(".photos_line>div");
                                          var nsuccess = 0;
                                          var nwarning = 0;
                                          var success = $($(".progress-bar-success")[0]);
                                          var warning = $($(".progress-bar-warning")[0]);
                                          for(j=0;j<checkpointids.length;j++){
                                            $.ajax({
                                              url: "/api/checkpoint/" + checkpointids[j] + "/mysubmissions",
                                              type: "get",
                                              dataType: "json",
                                              j: j,
                                              success: function(result){
                                                var j = this.j;
                                                var k;
                                                var max=0;
                                                for(k=0;k<result.length;k++){
                                                  if(result[k].photoStatus > max) max = result[k].photoStatus;
                                                }
                                                if(max==0) $($(photos[j]).find('a')[0]).attr('href', "/checkpoint_page?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[j]);
                                                else if(max==1){
                                                  $(photos[j]).toggleClass("submitted");
                                                  nwarning++;
                                                  warning.attr("style", "width: " + (100 * nwarning / checkpointids.length).toString() + "%");
                                            
                                                  $($(photos[j]).find('a')[0]).attr('href', "/checkpoint_page?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[j]);
                                                  $($(photos[j]).find('a')[0]).attr('onclick','alert("You have sent a photo that has not been checked yet, but you can still send other photos")');
                                                } 
                                                else if(max==2){
                                                  $(photos[j]).toggleClass("found");
                                                  nsuccess++;
                                                  success.attr("style", "width: " + (100 * nsuccess / checkpointids.length).toString() + "%");
                                                  if((100 * nsuccess / checkpointids.length) - 100 < 0.0001 && (100 * nsuccess / checkpointids.length) - 100 > -0.0001){
                                                    $("#modal").toggleClass("not_hidden");
                                                    $("#modal").toggleClass("hidden");
                                                    $($(".close")[0]).attr("onclick", "close()");
                                                  }
                                                  $($(photos[j]).find('a')[0]).attr('onclick','alert("You have already found this checkpoint! Try to find another one!")');
                                                }
                                              }
                                            });
                                          }
                                          if(registered){
                                            var success = $($(".progress-bar-success")[0]);
                                            var succes_percentage = 100 * nsuccess / checkpointids.length;
                                            success.attr("style", "width: " + succes_percentage.toString() + "%");

                                            var warning = $($(".progress-bar-warning")[0]);
                                            var warning_percentage = 100 * $(".submitted").length / checkpointids.length;
                                            warning.attr("style", "width: " + warning_percentage.toString() + "%");
                                            if(succes_percentage - 100 < 0.0001 && succes_percentage - 100 > -0.0001){
                                              $("#modal").toggleClass("not_hidden");
                                              $("#modal").toggleClass("hidden");
                                              $($(".close")[0]).attr("onclick", "close()");
                                            }
                                          }
                                        
                                      } 
                                });
                              }
                            }
                    });
                  }
          });
        }
});

/*
$.ajax({
        url: "/api/games/" + getQueryVariable('gameid') + "/checkpoints",
        type: "get",
        dataType: "json"
        success: function(checkpoints){
          var photosection = $("#checkpoints");
          photosection.append("<h3>Checkpoints</h3>");
          var i;
          for(i=0;i<checkpoints.length;i++){
            if(i%3 == 0){
              photosection.append('<div id="photos_line_' + (1+Math.floor(i/3).toString() + '" class="photos_line jumbotron"></div>'));
            }
            $("#photos_line_" + (1+Math.floor(i/3).toString()).append('<div class="photo jumbotron"><a class="link" href="#"><img src="' + checkpoints[i].checkpointImg + '" alt="Impossible to display the image"></a></div>'));
            checkpointids.push(checkpoints[i].checkpointID);
          }
          ajax2=true;
        }
});

while(!ajax2);

$.ajax({
        url: "/api/games/" + getQueryVariable('gameid') + '/ismanager',
        type: "get",
        dataType: 'json',
        success: function(result){
          if(result.admin){
              $('#not_registered').toggleClass('not_hidden');
              $('#not_registered').toggleClass('hidden');
              $('#admin').toggleClass('hidden');
              $('#admin').toggleClass('not_hidden');
              var photos = $(".photos_line>div>a");
              var i;
              for(i=0;i<photos.length;i++){
                photos[i].attr('onclick','open_unchecked('+ i.toString() +')');
              }
              ajax3=true;
          }else{
              $.ajax({
                  url: "/api/users/gamesplaying",
                  type: "get",
                  dataType: "json",
                  sucess: function(results){
                    var ajax=0;
                    if(results.indexOf(getQueryVariable('gameid')) >= 0){
                      registered = true;
                      $('#not_registered').toggleClass('not_hidden');
                      $('#not_registered').toggleClass('hidden');
                      $('#progression').toggleClass('hidden');
                      $('#progression').toggleClass('not_hidden');
                      var j;
                      var photos = $(".photos_line>div");
                      for(j=0;j<checkpointids.length;j++){
                        $.ajax({
                          url: "/api/checkpoint/" + checkpointids[j] + "/mysubmissions",
                          type: "get",
                          dataType: "json",
                          success: function(result){
                            var k;
                            var max=0;
                            for(k=0;k<result.length;k++){
                              max = max(result[k].photoStatus,max);
                            }
                            if(max==0) photos[j].find('a')[0].attr('onclick', 'open_checkpoint(false,' + i.toString() + ')');
                            else if(max==1){
                              photos[j].toggleClass("submitted");
                              photos[j].find('a')[0].attr('href', "checkpoint_page.html?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[i]);
                              photos[j].find('a')[0].attr('onclick','open_checkpoint(true,' + i.toString() + ')');
                            } 
                            else if(max==2){
                              photos[j].toggleClass("found");
                              photos[j].find('a')[0].attr('onclick','alert("You have already found this checkpoint! Try to find another one!")');
                            }
                            ajax++; 
                          }
                        });
                      }
                    }
                    while(ajax<checkpointids.length);
                    ajax3=true;
                  } 
            });
          }
        }
});*/


function close(){
  $("#modal").toggleClass("not_hidden");
  $("#modal").toggleClass("hidden");
}


function register(){
              $('#not_registered').toggleClass('not_hidden');
              $('#not_registered').toggleClass('hidden');
              $('#progression').toggleClass('hidden');
              $('#progression').toggleClass('not_hidden');
              $('#buttons').toggleClass('hidden');
              $('#buttons').toggleClass('not_hidden');
              registered = true;
              $.ajax({
                url: "/api/games/" + getQueryVariable('gameid'),
                type: "post",
                data: {gameID: getQueryVariable('gameid')}
              });
}

function open_unchecked(i){
  $.ajax({
    url: "/unchecked_photos?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[i],
    type: 'get'
  });
}

function open_checkpoint(submitted,i){
  if(submitted) alert("You have sent a photo that has not been checked yet, but you can still send other photos");
  $.ajax({
    url: "/checkpoint_page?gameid=" + getQueryVariable('gameid') + "&checkpointid=" + checkpointids[i],
  })
}
