var express = require('express');
var app = express();

// serves static files
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// error handling
app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500).end();
});

var PORT = 3000;

app.listen(PORT, function () {
	console.log('Listening on port:', PORT)
});

module.exports = app