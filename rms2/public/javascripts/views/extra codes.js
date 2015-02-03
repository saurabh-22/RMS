
        // console.log(this.model.urlRoot);
        // if($('#cand_id').val() == ""){
        //     this.model.urlRoot = "/resumes/add"
        // }else{
         //    self.model.urlRoot = "/resumes/"
         // // }

         + model.id,





         					// fs.readFile(req.files.ChooseFile.path, function (err, data) {
					// var newPath = __dirname + "/uploads/"+_id;
					//   fs.writeFile(newPath, data, function (err) {
					//     res.redirect("back");
					//   });
					// });


<% if(this.model.attributes.file){ %>
<td><a href="<%=this.model.attributes.file.name%>" download="<%https://mrms.s3.amazonaws.com/resumes/+name%>"><%=this.model.attributes.file.name%></a></td>
    <% }else{ %>
     <td></td>
    <% } %> 










        <script type="text/javascript">
        function clock() {

                var today = new Date();
                var day = today.getDay();
                var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
                        var dd = today.getDate();
                        var mm = today.getMonth();
                var Monthlist =     ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                        var yyyy = today.getFullYear();
                        if(dd<10) dd='0'+dd;
                        var hour = today.getHours();
                        var minute = today.getMinutes();
                        if(minute<10) minute='0'+minute;
                        var second = today.getSeconds();
                        var ampm = (hour >= 12)? " PM ":" AM ";
                        hour = (hour >= 12)? hour - 12: hour;
                        if(hour<10) hour='0'+hour;
                var date= (""+ daylist[day] + " ,  "+ dd +" "+Monthlist[mm]+" "+yyyy+"  " +hour +" : " + minute + ampm);
                        document.getElementById("time").innerHTML = date;
                        window.onload = clock;
  }
        </script>




        clearInput: function () { 
    //Clear all Textboxes 
    $("#tblinput input").val(''); 
} 


// s3 put object
var AWS = require('aws-sdk');
AWS.config.update(
  {
    accessKeyId: ".. your key ..",
    secretAccessKey: ".. your secret key ..",
  }
);
var s3 = AWS.S3();
s3.getObject(
  { bucket: "my-bucket", key: "my-picture.jpg" },
  function (error, data) {
    if (error != null) {
      alert("Failed to retrieve an object: " + error);
    } else {
      alert("Loaded " + data.ContentLength + " bytes");
      // do something with data.body
    }
  }
);