//var fs = require('fs'),
//    path = require('path'),
//    os = require('os');
//var css = require('css');
//var express = require('express');
//var busboy = require('connect-busboy');
var redis = require('redis');

var redisClient = redis.createClient();

var argument = process.argv.slice(2);
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
var ab = redisClient.hgetall(argument[0]+"_used",redisGetallHandler);



//redisClient.hdel("map",".navbar-ex1-collapse");

