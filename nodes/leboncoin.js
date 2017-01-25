var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var meilleursagents = require('./meilleursagents');




/**
 * Array cleaner utility
 * overwriting array by adding a clean method
 * delete all elements containing the given delete value
 * ex: myArray.clean(undefined).clean('');
 **/
Array.prototype.clean = function (deleteValue) {

};

function cleanArray(arrayToClean, valueToClean) {
    for (var i = 0; i < arrayToClean.length; i++) {
        if (arrayToClean[i] == deleteValue) {
            // If the value is the one we want to chop off, 
            // we suppress it from the array
            arrayToClean.splice(i, 1);
            
            // We suppress one element so the ones after it will have their index
            // decreased by one. 
            //  i  i+1 i+2 i+3       i  i+1 i+2  i+3       i  i+1 i+2 
            //| w | x | y | z | -> | w | x | __ | z | -> | w | x | z | 
            //Since the i variable will get increased, we decreased 
            // right before it, to avoid missing an element
            i--;
        }
    }
    return arrayToClean;
}


exports.request = function (url) {

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var city, zipcode, price, surface, type;
            var annonce = {
                "title": "Ad schema",
                "type": "object",
                "properties": {
                    'price': 0.0,
                    'city': 'Unknown',
                    'zipcode': 00000,
                    'type': 'Unknown',
                    'surface': 0.0,
                },
                "required": ["price", "city", "type", "surface"]
            };


            $('.properties .line .item_price').each(function () {
                price = $(this).attr("content");
            });

            $('.line_city .clearfix .value').each(function () {
                var list = $(this).text().split(' ').clean(undefined).clean('');
                var list_size = list.length;
                city = list[0];
                for (var i = 1; i < list_size - 1; i++) {
                    city += list[i];
                }
                zipcode = parseInt(list[list_size - 1]);
                console.log("City: " + city + ", ZIP: " + zip);
            });

            $('.line .clearfix .property').each(function () {
                if ($(this).text() === 'Type de bien') {
                    type = $(this).next().text();
                }
            });

            $('.line .clearfix .value sup').each(function () {
                surface = parseInt($(this).parent().text().split(' ')[0]);
            });
            
            annonce.price = price;
            annonce.city = city;
            annonce.zipcode = zipcode;
            annonce.type = type;
            annonce.surface = surface;
            

            fs.writeFileSync("./lbc_data.json", JSON.stringify(json));

            console.log("Data stored in ./lbc_data.json");
        }

        meilleursagents.request();
    })
};
