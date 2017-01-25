var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var url = require('url');

app.get('/scrape', function(req, res){

    //Get the url
    var urlParam = req.query.url;
    
    
    
    

})

app.listen('8081')

console.log('Magic happens on port 8081... Well, magic, or something more... magical !');

exports = module.exports = app;