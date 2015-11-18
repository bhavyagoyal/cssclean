var fs = require('fs'),
    path = require('path'),
    os = require('os');
var css = require('css');
var express = require('express');
var busboy = require('connect-busboy');
var redis = require('redis');

var redisClient = redis.createClient();

var app = express();
app.set('views', './views');
app.set('view engine', 'jade');

app.use(busboy());

app.get('/', function(req, res){
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});


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

function redisGetHandler(err, reply) {
    // reply is null when the key is missing
    console.log("reply"+reply);
};

//function redisGetallHandler(err, obj) {
//	var keys = [];
//	for (var key in obj) {
//		if (obj[key]==1){
//			keys.push(key);
//		}
//	}
//	console.log(keys);
//};


var id="";
app.post('/', function(req, res) {
    var tmpFilePath;
    req.pipe(req.busboy);
    var dataFile;
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        
        tmpFilePath = path.join(os.tmpDir(), path.basename(filename)); // TODO make it unique
        file.pipe(fs.createWriteStream(tmpFilePath));

        file.on('data', function(data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
	    dataFile = dataFile + data;
        });
        file.on('end', function() {
            console.log('File [' + fieldname + '] Finished');
        });
    });
    req.busboy.on('finish', function() {
        //var filecontent = String(fs.readFileSync(tmpFilePath, 'utf8'));
	//console.log(filecontent);
	id = makerandomid(8);
        var ast = css.parse( dataFile, {
            source: tmpFilePath
        });
	//console.log(ast);
        if(typeof ast.type == "undefined" || ast.type != "stylesheet") {
            var astType = ast.type || "undefined";
            res.writeHead(200, { 'Connection': 'close' });
            res.end("Invalid stylesheet: AST type is " + astType);
        }
	//console.log(ast);
	console.log("got here");
        console.log(ast.stylesheet.rules.length);
        for(var i in ast.stylesheet.rules) {
            var styleRule = ast.stylesheet.rules[i];
            //console.log(styleRule);
		if(styleRule.type=="media"){
			for(var k in styleRule.rules){
				var styleRule2 = styleRule.rules[k];
				for (var j in styleRule2.selectors){
					console.log(styleRule2.selectors[j]);
                			redisClient.hmset(id+"_unused",styleRule2.selectors[j],1,redisSetHandler);
				}
			}
		}
		else{
	    	    for(var j in styleRule.selectors){
        	        redisClient.hmset(id+"_unused",styleRule.selectors[j],1,redisSetHandler);
                	console.log(styleRule.selectors[j]);
		//redisClient.set(styleRule.selectors[j],1,redisSetHandler);
            		}
		}
	}
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks! File saved at: " + tmpFilePath + "\n ID: "+id+"\n\n");
    });
});

var server = app.listen(2307, function() {
    console.log('Listening on port %d', server.address().port);
});

