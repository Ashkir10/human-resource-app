
let http = require("http");
let employeeService = require("./lib/employees");

let responder = require("./lib/responseGenerator");
let staticFile = responder.staticFile("/public");

http.createServer(function(req, res) {

    let _url;   // A parsed url to work with in case there are parameters.

    req.method = req.method.toUpperCase();

    console.log(req.method + ' ' + req.url);

    if (req.method !== "GET") {
        res.writeHead(501, { "Content-type" : "text/plain"});
        return res.end(req.method + " is not implemented by this server!");
    }

    // ----- ROUTING

    if (_url = /^\/employees$/i.exec(req.url)) {
        
        employeeService.getEmployees(function(error, data) {
            if (error) {
                // send a 500 error.
                responder.send500(error, res);
            }

            // send data with 200 status code.
            responder.sendJson(data, res);
        });
    } else if (_url = /^\/employees\/(\d+)$/i.exec(req.url)) {
        
        employeeService.getEmployee(_url[1], function(error, data) {
            if (error) {
                // send a 500 error.
                responder.send500(error, res);
            }

            if (!data) {
                // send a 404 error.
                responder.send404(res);
            }

            // send the data with 200 status code.
            responder.sendJson(data, res);
        });

    } else {
        // try to send the static file.
        // if not, send 404 error.
        staticFile(req.url, res);
    }

    
    

}).listen(process.env.PORT || 1337);

console.log("Server running at http://127.0.0.1:1337");