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

function update(){
	$('.updateForm').submit(function(e){
		//store info from form
		var firstName = $("#inputFName").val();
		var lastName = $("#inputLName").val();
		var username = $("#inputUName").val();
		var country = $("#inputCountry").val();
		var city = $("#inputCity").val();
    	var active = $("input[name=optionsAD]").val();
    	var isAdmin = $("input[name=optionsALvl]").val();
    	alert("Changing: \nfirst name to: " + firstName + "\n" 
    		+ "last name to: " + lastName + "\n" 
    		+ "alias to: " + username + "\n"
			+ "country to: " + country + "\n" 
			+ "city to: " + city + "\n" 
			+ "admin status to: " + isAdmin + "\n" 
			+ "active status to: " + active + "\n");

    //send req to server to update account info 
		$.ajax({
      		type: "POST",
			url: "/api/users/updateAccount",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ 
				"firstName": firstName,
				"lastName": lastName,
				"username": username,
				"country": country,
				"city": city,
				"isAdmin": isAdmin,
				"active": active
			}),
			success: function(res) {
        		alert("Account info updated!");
			}
		});
	
    e.preventDefault();
    
  })
}
