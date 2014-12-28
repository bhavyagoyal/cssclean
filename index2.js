//var fs = require('fs'),
//    path = require('path'),
//    os = require('os');
//var css = require('css');
//var express = require('express');
//var busboy = require('connect-busboy');
var redis = require('redis');

var redisClient = redis.createClient();

//function redisSetHandler(error, result){
//    if (error) console.log('Error redis: ' + error);
//    //else console.log('Saved');
//};

//function redisGetHandler(err, reply) {
//    // reply is null when the key is missing
//    console.log("reply"+reply);
//};

function redisGetallHandler(err, obj) {
	var keys = [];
	for (var key in obj) {
		if (obj[key]==0){
			keys.push(key);
		}
	}
	console.log(keys);
};

console.log("got here");
var ab = redisClient.hgetall("map2",redisGetallHandler);



//redisClient.hdel("map",".navbar-ex1-collapse");

