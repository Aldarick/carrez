var request = require('request');
var cheerio = require('cheerio');
var functions = require('functions')
var fs = require('fs');



exports.request = function (tolerance, res) {
    console.log('going to meilleurs agents');

    var jsonLBC = require('../Json/dataLBC.json');

    // Since the special characters can create problems and may not be read properly, we replace
    // them with standard characters
    var urlSuffix = jsonLBC.city.toLowerCase().replace(" ", "-").replace('é', 'e').replace('è', 'e').replace('à', 'a').replace('ç', 'c') + "-" + jsonLBC.zip.toString();
    
    // Paris is a special case, because we have to put the 'arrondissement'
    if (urlSuffix.includes('paris')) {
        var urlSuffix2 = urlSuffix.split('-');
        var arr = parseInt(urlSuffix2[1]) % 75000;
        var adj;
        if (arr === 1) {
            adj = "er";
        } else {
            adj = "eme";
        }
        urlSuffix = "paris-" + arr + adj + "-arrondissement-" + jsonLBC.zip.toString();
    }

    
    request("https://www.meilleursagents.com/prix-immobilier/" + urlSuffix + "/", function (errorOccured, response, html) {

        // Don't process if there was an error
        if (!errorOccured) {

            var $ = cheerio.load(html);

            var avgPrices = [];

            $('.row.baseline--half .prices-summary__cell--median').each(function () {
                
                var listCleaned = $(this).text().split(' ');
                var listCleaned = listCleaned.cleanArray(undefined);
                var listCleaned = listCleaned.cleanArray('');
                var listCleaned = listCleaned.cleanArray('\n');
                var listCleaned = listCleaned.cleanArray('&euro;\n');
                var listCleaned = listCleaned.cleanArray('&nbsp;');
                
                var item = listCleaned[0];
                avgPrices.push(parseFloat(item.replace(/\s/g, "")));
            });

            var jsonMA = new Object();
            jsonMA.estate = new Object();
            jsonMA.estate.city = jsonLBC.city;
            jsonMA.estate.zip = jsonLBC.zip;
            jsonMA.estate.price = jsonLBC.price;
            jsonMA.estate.surface = jsonLBC.surface;
            jsonMA.estate.type = jsonLBC.type;
            jsonMA.estate.smp = jsonLBC.price / jsonLBC.surface;
            jsonMA.estate.url = jsonLBC.url;
            jsonMA.estate.img = jsonLBC.img;

            jsonMA.averagePricePerSquareHouse = avgPrices[1];
            jsonMA.averagePricePerSquareFloor = avgPrices[0];

            jsonMA.href = "https://www.meilleursagents.com/prix-immobilier/" + urlSuffix + "/";

            jsonMA.tolerance = tolerance;


            fs.writeFileSync("../Json/dataMA.json", JSON.stringify(jsonMA));

            res.redirect('./scrapped?city=' + jsonMA.estate.city +
                '&zip=' + jsonMA.estate.zip +
                '&type=' + jsonMA.estate.type +
                '&price=' + jsonMA.estate.price +
                '&surface=' + jsonMA.estate.surface +
                '&smp=' + jsonMA.estate.smp +
                '&averagePricePerSquareHouse=' + jsonMA.averagePricePerSquareHouse +
                '&averagePricePerSquareFloor=' + jsonMA.averagePricePerSquareFloor +
                '&tolerance=' + jsonMA.tolerance +
                '&href=' + jsonMA.estate.href +
                '&hrefMA=' + jsonMA.hrefMA);
        }

    })
};

Contact GitHub API Training Shop Blog About

© 2017 GitHub, Inc.Terms Privacy Security Status Help
