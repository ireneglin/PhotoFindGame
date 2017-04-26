// function to convert image to base64 before send
// base 64 image convert code from http://stackoverflow.com/questions/17710147/image-convert-to-base64
    File.prototype.convertToBase64 = function(callback){
            var reader = new FileReader();
            reader.onload = function(e) {
                 callback(e.target.result)
            };
            reader.onerror = function(e) {
                 callback(null);
            };        
            reader.readAsDataURL(this);
    };


    $("#imagefile").on('change',function(){
      var selectedFile = this.files[0];
      selectedFile.convertToBase64(function(base64){
           var input = document.createElement('input');
           input.value=base64;
           input.type="hidden";
           input.id="checkpointImg";
           input.name="checkpointImg";
           document.getElementById('b64image').appendChild(input);
           var displayimg = document.createElement('img');
           displayimg.src=base64;
           displayimg.id="upload-photo";
           document.getElementById('b64image').appendChild(input);
           document.getElementById('b64imageDisplay').appendChild(displayimg);
           document.getElementById('b64filename').append(selectedFile.name);

      }) 
    });