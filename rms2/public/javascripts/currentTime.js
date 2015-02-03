
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
                // alert(""+ daylist[day] + " ,  "+ dd +" "+Monthlist[mm]+" "+yyyy+"  " +hour +" : " + minute + ampm);

  }