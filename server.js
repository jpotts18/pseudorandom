var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var winston = require('winston');

winston.add(winston.transports.File, { filename: 'winston.log' });
winston.info('Logging');

app.use(express.static('public'));
app.use(bodyParser.raw({limit: '10mb'}))

app.get('/', function (req, res) {
  res.sendFile('index.html');
  winston.info('GET - /');
});

app.get('/grid', function(req, res, next) {
  res.sendFile('grid.html', { root: path.join(__dirname, 'public') });
  winston.info('GET - /grid');
});

app.get('/loop', function(req, res, next) {
  res.sendFile('lg-view.html', { root: path.join(__dirname, 'public') });
  winston.info('GET - /loop');
});
app.get('/images', function(req, res, next) {
  winston.info('GET - /images');
  fs.readdir('public/new-images', function(err, files) {
    if (err) {
      console.log(err);
    }

    console.log(files);
    res.send(files);
  });
});

app.post('/save', function(req, res, next) {
  winston.info('POST - /save');
  winston.info('starting save');

  // app.use(bodyParser.json({limit: '150mb'}));
  // app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

  var body = "";

  req.on('data', function(data) {
    body += data;
    // winston.info('your body = ' + body);
  });

  req.on('end', function (){
    var split = body.indexOf('data');
    var imgName = body.slice(0, split);
    var dataStart = body.toString().indexOf(',') + 1;
    var decodedImage = new Buffer(body.substring(dataStart), 'base64');
    winston.info('Writing: ' + imgName);
    fs.writeFile('public/new-images/' + imgName + '.jpg', decodedImage, function(err) {
      if (err) winston.info('Error: ' + err);
      else winston.info('Success: Saved ' + imgName);
    });
  });

  function callback(err) {
    if(err) console.log('broken');
    else console.log("yay")
  }

  res.send("Done");

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
