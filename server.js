var express = require("express")
var app = express();

app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    res.end(JSON.stringify({hello: 'world'}));
})

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('The app is listening on: ' + port);
})