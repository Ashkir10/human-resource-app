
let fs = require("fs");

exports.send404 = send404;
exports.sendJson = sendJson;
exports.send500 = send500;
exports.staticFile = staticFile;


function send404(res) {
    console.error("Resource not found!");

    res.writeHead(404, { "Content-type" : "text/plain"});
    res.end("Not found");
}


function sendJson(data, res) {
    res.writeHead(200, { "Content-type" : "application/json"});
    res.end(JSON.stringify(data));
}


function send500(error, res) {
    console.error(error.red);

    res.writeHead(505, { "Content-type" : "text/plain"});
    res.end("500 Internal Server Error");
}


function staticFile(staticPath) {
    return function(data, res) {
        
        let readStream;

        // fix so that routes to /home and /home.html both work.
        let result = data.replace(/(\/\w+)(.html)?$/i, "$1.html");
        result = "." + staticPath + result;

        fs.stat(result, function(error, stats) {
            if (error || stats.isDirectory()) {
                return send404(res);
            }

            readStream = fs.createReadStream(result);
            return readStream.pipe(res);
        });

    }
}