var request = require('request');
var cheerio = require('cheerio');
var functions = require('functions')
var fs = require('fs');
var meilleursagents = require('./meilleursagents');


exports.request = function (url, tolerance, res) {

    request(url, function (errorOccured, response, html) {


        // Don't process if there was an error
        if (!errorOccured) {

            var $ = cheerio.load(html);

            var json = {
                "title": "Ad schema",
                "type": "LBC",
                "properties": {
                    'city': 'Unknown',
                    'price': 0.0,
                    'zipcode': 00000,
                    'type': 'Unknown',
                    'surface': 0.0,
                    'href' : "https//nothing.com"
                },
            };
            
            var city, price, zipcode, type, surface;

            // Find the price
            $('.properties .line .item_price').each(function () {
                price = $(this).attr("content");
            });

            // Find the city and the zip code
            $('.line_city .clearfix .value').each(function () {
                var listCleaned = $(this).text().split(' ');
                var listCleaned = listCleaned.cleanArray(undefined);
                var listCleaned = listCleaned.cleanArray('');
                
                var listSize = list.length;
                // Replace the problematic characters with a standard e. It will ensure
                // there's no problem of encoding when parsing the data
                city = list[0].replace('é', 'e').replace('�', 'e');
                for (var i = 1; i < listSize - 1; i++) {
                    city += " " + list[i].replace('é', 'e').replace('�', 'e');
                }
                zip = parseInt(list[listSize - 1]);
            });

            // Find the type
            $('.line .clearfix .property').each(function () {
                if ($(this).text() === 'Type de bien') {
                    type = $(this).next().text();
                }
            });

            
            $('.line .clearfix .value sup').each(function () {
                surface = parseInt($(this).parent().text().split(' ')[0]);
                console.log("Found surface-area: " + surface + " squared meters");
            });


            json.properties.zipcode = zipcode;
            json.properties.city = city;
            
            // Parse the price and the surface as float
            json.properties.price = parseFloat(price);
            json.properties.surface = parseFloat(surface);
            
            json.properties.type = type;
            json.properties.href = url;
            
            fs.writeFileSync("../Json/dataLBC.json", JSON.stringify(json));
        }
        ma_scrap.request(tolerance, res);
    })
};
