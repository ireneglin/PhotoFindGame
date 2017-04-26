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

function hint(){
		$('#seehint').toggleClass("hidden");
		$('#hint').toggleClass("hidden");
		$('#hint').toggleClass("not_hidden");
		$.ajax({
			url: "/api/users/"+ getQueryVariable('gameid') +"/seehint",
			type: "post",
			dataType: "json",
			data: {gameID: getQueryVariable('gameid')}
		});

}

function upload(){
	$("#submitform").toggleClass("hidden");
	$("#submitform").toggleClass("not_hidden");
	$("#upload").toggleClass("hidden");
}

function uploadphoto(){
	$.ajax({
		url: "/api/checkpoint/" + getQueryVariable('checkpointid') + '/submissions',
		type: "post",
		dataType: 'json',
		data: {
			submissionPhoto: reader.result
		},
		success: function(){
			alert("The photo has been uploaded! Come back later to see if it is accepted or not.");
			goBack();
		}
	});

}

$.ajax({
	url: "/api/games/" + getQueryVariable('gameid'),
	type: "get",
	dataType: "json",
	success: function(result){
		$("#gametitle").html(result[0].gameName);
		$("#gameplace").html(result[0].gameCity + ", " + result[0].gameCountry);

	}
});

$.ajax({
	url: "/api/checkpoint/" + getQueryVariable("checkpointid"),
	type: 'get',
	dataType: "json",
	success: function(result){
		$("#checkpointphoto").attr('src', result[0].checkpointImg);
		$("#hint").html(result[0].checkpointHint);
		var i;
	}
});

var reader  = new FileReader();

function previewPhoto() {
  var preview = $('#preview');
  var file    = document.querySelector('input[type=file]').files[0];

  reader.addEventListener("load", function () {
    preview.attr('src', reader.result);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}


function goBack() {
    window.history.back();
}