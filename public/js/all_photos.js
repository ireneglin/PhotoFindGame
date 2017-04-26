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

var selected_photo = 0;
var handled_photos = [];
var submissionsinpage = [];
var photos;

var modal = $("#modal");

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
        }
});

$.ajax({
        url: "/api/checkpoint/" + getQueryVariable('checkpointid') + "/submissions",
        type: "get",
        dataType: "json",
        success: function(submissions){
          var photosection = $("#submissions");
          photosection.append("<h3>Submissions</h3>");
          var i;
          for(i=0;i<submissions.length;i++){
            if(i%3 == 0){
              photosection.append('<div id="photos_line_' + (1+Math.floor(i/3)).toString() + '" class="photos_line jumbotron"></div>');
            }
            $("#photos_line_" + (1+Math.floor(i/3)).toString()).append('<div class="jumbotron photo" id="photo' + (i+1).toString() + '"><img id="img' + (i+1).toString() + '" src="'+ submissions[i].submissionPhoto +'" alt=Status ' + submissions[i].photoStatus +'></div>');
            submissionsinpage.push(submissions[i]);
          }
          photos = $(".photo");
          var i;
			for(i=0; i<photos.length; i++){
				$(photos[i]).attr('onclick', 'listener(parseInt(this.id.slice(5)))');
			}
        }
});

$($(".close")[0]).attr('onclick', 'close()');

$("#refuse").attr('onclick', 'refuse()');

$("#accept").attr('onclick', 'accept()');

function listener(id){
		var k = 0;
		while(k < handled_photos.length && handled_photos[k] !== id){
			k++;
		}
		if(handled_photos[k] !== id){
			if(selected_photo == 0){
				modal.toggleClass("hidden");
				modal.toggleClass("not_hidden");
			}
			selected_photo = id;
			$("#selected_photo").attr('src', $('#img' + selected_photo.toString()).attr("src"));
			$("#date").html("Posted " + submissionsinpage[id-1].submissionDate);
		}
	}

function close(){
	selected_photo = 0;
	modal.toggleClass("hidden");
	modal.toggleClass("not_hidden");
}

function refuse(){
	$(photos[selected_photo-1]).toggleClass("refused");
	handled_photos.push(selected_photo);
	$.ajax({
		url: "/api/checkpoint/submissions/reject",
		type: 'post',
		data: submissionsinpage[selected_photo-1]
	});
	selected_photo = 0;
	modal.toggleClass("hidden");
	modal.toggleClass("not_hidden");
}

function accept(){
	$(photos[selected_photo-1]).toggleClass("accepted");
	handled_photos.push(selected_photo);
	$.ajax({
		url: "/api/checkpoint/submissions/approve",
		type: "post",
		data: submissionsinpage[selected_photo-1]
	})
	selected_photo = 0;
	modal.toggleClass("hidden");
	modal.toggleClass("not_hidden");
}


function goBack() {
    window.history.back();
}