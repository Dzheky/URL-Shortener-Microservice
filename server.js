var express = require("express");
var validator = require('validator');
var mongo = require("mongodb").MongoClient;
var urls = require("url");
var dburl = "mongodb://test:123456789@ds017553.mlab.com:17553/shortlinks"

mongo.connect(dburl, function(dberr, db) {
    function colId(callback) {
        collection.count({}, callback)
    }
    if(dberr) throw dberr;
    var collection = db.collection('urls');
    var app = express();
    app.use(express.static(__dirname+'/public'));
    app.get('/', function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/HTML'});
        
        res.sendFile('index.html');
    })
    app.get('/new/:url*', function(req, res) {
        res.writeHead(200, {"Content-Type": "application/JSON"});
        var link = req.params.url + req.params[0];
        if (validator.isURL(link)) {
                colId(function(err, id) {
                    if(err) throw err;
                    collection.insert({
                        _id: id,
                        url: link
                    }, function(err, result) {
                        if (err) throw err;
                    })
                res.end(JSON.stringify({
                    original: link,
                    short: id
                }))
            });
        } else {
            res.end(JSON.stringify({
                error: 'Wrong url format. Acceptable formats: http://www.example.com/, www.example.com, example.com'
            }))
        }
    })
    app.get('/:urlID', function(req, res) {
        var id = +req.params.urlID
        console.log(req.params.urlID);
        collection.findOne({
            _id: id
        }, function(err, docs) {
            if (err) throw err;
            if(!docs) {
                res.end(JSON.stringify({
                    error: "There is no such id!"
                }))
            } else {
                var url1 = '';
                if (urls.parse(docs.url).protocol === null) {
                    url1 = "http://"+docs.url;
                    console.log('no protocol ' + url1);
                } else {
                    url1 = docs.url;
                    console.log('protocol ' + url1);
                }
                res.writeHead(301, {Location: url1});
                res.end();
            }
        });
        
        
    })
    var port = process.env.PORT || 8080;

    app.listen(port, function() {
        console.log('The app is listening on: ' + port);
    })
});
