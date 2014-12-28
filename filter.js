console.log("in the file");

var Hostname = "http://10.0.15.112:8080";
var text ="list";
var text2="";
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("POST",Hostname,true);
xmlhttp.setRequestHeader("Content-Type", "text/plain");

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
		//if(xmlhttp.responseText == "saved"){
		//	console.log("time to end");
		//	return;
		//}
		console.log(xmlhttp.responseText);
        	var a = JSON.parse(xmlhttp.responseText);
		var inter = window.setInterval(function(){
		var newresponse=[];
		console.log(a.length);
		for (var j=0;j<a.length;j++){
			//console.log(a[j]);
			try{
				if($(a[j]).length>0){
					//console.log(a[0]);
					newresponse.push(a[j]);
					a.splice(j,1);
					j = j-1;
				}
			}
			catch(e){
				console.log(e.message);
			}
		}
		if(newresponse.length==0){
			window.clearInterval(inter);
		}
		else{
			text2 = JSON.stringify(newresponse);
			console.log(text2);
			//xmlhttp.abort();
			xmlhttp.open("POST",Hostname,true);
			xmlhttp.setRequestHeader("Content-Type", "text/plain");
			xmlhttp.onreadystatechange = function() {
        	    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	    			console.log(xmlhttp.responseText);
				}
        		}
			xmlhttp.send(text2);
		}
		},500);
        }
    }


xmlhttp.send(text);

