'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 9527;

app.listen(port,function(){
    console.log('Listening on port', port);
});