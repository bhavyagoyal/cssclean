var http = require('http');
var select = [];
var str;
var redis = require('redis');
var redisClient = redis.createClient();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var argument = process.argv.slice(2);

function makerandomid(n)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function redisSetHandler(error, result){
    if (error) console.log('Error redis: ' + error);
    //else console.log('Saved');
};

//function redisGetallHandler(err, obj) {
//        select = [];
//        var key = Object.keys(obj);
//        for(var j=0;j<100;j++){
//                select.push(key[getRandomInt(0,key.length)]);
//        }
//	str = JSON.stringify(select);
//	//console.log(str);
//};

http.createServer(function (req, res) {
if(req.method==="POST"){
  res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
  var body = '';
  req.on('data', function(chunk) {
    body += chunk.toString('utf8');
  });
  req.on('end', function() {
    if(body=='list'){
		//console.log("list here");
		redisClient.hgetall(argument[0]+"_unused",function(err,obj){
			select = [];
			var key = Object.keys(obj);
			for(var j=0;j<Math.min(100,key.length);j++){
				select.push(key[getRandomInt(0,key.length)]);
 			}
			str = JSON.stringify(select);
			res.end(String(str));
			}
		);
	}
	else{
		console.log("entered");
		console.log(body);
		try {
   			var p = JSON.parse(body);
			for(var j=0;j<p.length;j++){
			redisClient.hmset(argument[0]+"_used",p[j],0,redisSetHandler);
			redisClient.hdel(argument[0]+"_unused",p[j]);
			}
			res.end("saved");
		} catch(err) {
    			console.log("Error: -- %s", err);
		}
		//var p = JSON.parse(body);
	}
  });
}
else {
    res.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return res.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }

}).listen(8080,'localhost');
console.log('Server running');

//console.log(makerandomid(8));
