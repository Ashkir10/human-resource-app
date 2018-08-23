// file connection.js: Establishes a database connection and registers the mongoose models.


let mongoose = require("../node_modules/mongoose");
exports.dbUrl = "mongodb://heroku_mz9tl870:h3a5qmaeei2pm94f5leq0piv1a@ds221242.mlab.com:21242/heroku_mz9tl870" || "mongodb://localhost:27017";
exports.db = mongoose.connection;



// Close the mongoose connection on Ctrl+C.
process.on("SIGINT", function() {
    db.close(function() {
        console.log("Mongoose default connection disconnected!");
    });
    process.exit();
});

require("../models/employee");
require("../models/team");

