
var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var open=require('./open');
var os = require("os");

function start(port)
{
	var server = http.createServer(function (request, response) {
		var pathname = url.parse(request.url).pathname;
		var realPath =path.join("./", pathname);
	//	path.join("assets", pathname);
		//console.log(realPath);
		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';
		fs.exists(realPath, function (exists) {
			if (!exists) {
				response.writeHead(404, {
					'Content-Type': 'text/plain'
				});

				response.write("This request URL " + realPath + " was not found on this server.");
				response.end();
			} else {
				fs.readFile(realPath, "binary", function (err, file) {
					if (err) {
						response.writeHead(500, {
							'Content-Type': 'text/plain'
						});
						response.end(err);
					} else {
						var contentType = mine[ext] || "text/plain";
						response.writeHead(200, {
							'Content-Type': contentType
						});
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	});
	server.listen(port,function(){
	open('http://'+ findIP()+ ":" +port+'/release/index.html');
	});
	console.log("Server runing at port: " + port + ".");
}
function findIP() {
	var ipConfig = os.networkInterfaces();
	var ip = "localhost";
	for (var key in ipConfig) {
		var arr = ipConfig[key];
		var length = arr.length;
		for (var i = 0; i < length; i++) {
			var ipData = arr[i];
			if (!ipData.internal && ipData.family == "IPv4") {
				ip = ipData.address;
				return ip;
			}
		}
	}
	return ip;
}
var portserver = http.createServer();
portserver.listen(0,function() { 
var port = portserver.address().port;
portserver.close();
start(port);
})