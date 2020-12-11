var crypto = require('crypto');
var express = require('express');
var app = express();
// The shared secret as generated in our Wowza application (Playback security tab) - use your own
var sharedSecret = 'mySharedSecret';

// The path of the content - use your own
//var contentPath = 'vodsecure/sample.mp4';
// The Hash Query Parameter Prefix as set in Wowza application
var customSecureTokenPrefix = 'myTokenPrefix';
// A custom paramater to add pepper and salt to security - use your own
//var customParam = 'abcdef';

// Starts: Thu, 10 Dec 2020 12:49:35 GMT
//var startTime = '1607604575';
//var startTime = '1395230400';
// Ends: Thu, 10 Dec 2030 12:49:35 GMT
//var endTime = '1923137375';
//var endTime = '1500000000';

// Client IP
//var ClientIPAddress = '88.252.90.96';

//starttime timestamps in seconds
//var startTime = Math.round(Date.now() / 1000);
//var expiretime = 15*60*1000;
//var endTime = Math.round((Date.now() + expiretime) / 1000);
//console.log('StartTime ' + startTime)
//console.log('Endtime ' + endTime)

var toHash;
// Adding CORS headers
app.use('/generate-hash', function (req, res, next) {
  res.header("Access-Control-Allow-Origin",
      "*");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// We get the hash at /generate-hash
app.get('/generate-hash', function (req, res, next) {
  var startTime = req.query.startTime 
  var endTime = req.query.endTime
  var customParam = req.query.customParam
  var contentPath = req.query.contentPath
  console.log('startTime :', startTime) 
  console.log('endTime :', endTime)
  console.log('customParam:', customParam)
  console.log('contentPath:', contentPath)
  
  toHash = contentPath + '?' +
           //ClientIPAddress + '&' +
           sharedSecret + '&' + 
           customSecureTokenPrefix + 'CustomParameter=' + customParam + '&' +
           customSecureTokenPrefix + 'endtime=' + endTime + '&' +
           customSecureTokenPrefix + 'starttime=' + startTime; 
           
           
          
  var hash = crypto.createHash('sha256').
      update(toHash, "utf8").
      digest('base64');
  hash = hash.replace(/\//g, '_'); 
  hash = hash.replace(/\+/g, '-');
  console.log(hash);
  console.log(toHash);
  res.send(hash);
});
// Listen for requests
var server = app.listen(3000, '127.0.0.1', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
//Add Header for requests
app.get('/getip', function (req, res){
  var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '192.168.1.1';
  console.log ('client_IP =', IP)
  res.send(IP)

  if (forwardedIpsStr) {
     IP = forwardedIps = forwardedIpsStr.split(',')[0];  
  }
});