var http = require('http');
var server = http.createServer();
server.listen(0,function() { 
var port = server.address().port;
console.log(port);
})