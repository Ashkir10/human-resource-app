
let waterfall = require("../node_modules/async/waterfall");
let series = require("../node_modules/async/series");
let mongoose = require("../node_modules/mongoose");

let Schema = mongoose.Schema;

let db = mongoose.connection;
let dbUrl = "mongodb://heroku_mz9tl870:h3a5qmaeei2pm94f5leq0piv1a@ds221242.mlab.com:21242/heroku_mz9tl870" || "mongodb://localhost:27017";
// let dbUrl = "mongodb://localhost:27017";

db.on('error', function() {
    console.log("Error communicating with database!");
    process.exit();
});






// ------- SCHEMAs ---------------

// Team schema.
let TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Employee schema.
let EmployeeSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    
    // Creates a reference to another document or schema.
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team" // which model to use.
    },
    image: {
        type: String,
        default: 'image/user.png'
    }, 
    address: {
        lines: {
            type: [String]
        },
        postal: {
            type: String
        }
    }
});

// ----- MODELLING ----------------

// Model a collection in memory.
let Team = mongoose.model('Team', TeamSchema);

let Employee = mongoose.model('Employee', EmployeeSchema);



// -----CONNECTION -----------

mongoose.connect(dbUrl, function(err) {

    if (err) {
        console.error("Problem communicating with database!" + err);
    }

    console.log("---------CONNECTED----------");

    // Adding a single document. ie. a single team.

    waterfall([
        function teamDocsCount(callback) {
            let count;
            Team.find().exec(function(err, result) {
                if (err) { console.error("Couldn't get count of Team docs! " + err); }
                else {
                    console.log("Count of Team docs are: " + result.length);
                    count = result.length;
                    callback(null, count);
                }
            });
            
        },
        function removeAllDocsOnThreshold(count, callback) {
            if (count > 0) {
                Team.remove( {}, function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Removed All Items from Team");
                    }
                });
            }

            callback(null);
        },
        function insertTeams(callback) {

            Team.create([{
              name: 'Product Development'
            }, {
              name: 'DevOps'
            }, {
              name: 'Accounting'
            }], function (error, teamCollection) {
              if (error) {
                console.error("Error inserting team docs! " + error);
                callback(error);
              } else {
                console.info('teams successfully added');
                console.log(teamCollection);
                callback(null, teamCollection);
              }
            });
        },
        function removeAllEmployeesOnThreshold(teamCollection, callback) {
   
            let count;
            Employee.find().exec(function(err, result) {
                if (err) { console.error("Couldn't get count of Employee docs! " + err); }
                else {
                    console.log("Count of Employee docs are: " + result.length);
                    count = result.length;

                    if (count === 0) {
                        console.info("No Employees! Adding Employees...");
                        callback(null, teamCollection);
                    } else {
                        Employee.remove({}, function(err) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.info("All Employees removed!");
                                console.info("Adding Employees...");
                                callback(null, teamCollection);
                            }
                        }); 

                    }
                    
                }
            });
        },
        function insertEmployees(teamCollection, callback) {


            // adding multiple employee documents/objs at once in db.
            
            Employee.create([{
                name: {
                    first: 'John',
                    last: 'Adams'
                },
                team: teamCollection[0]._id,
                address: {
                    lines: ['2 Lincoln Memorial Cir NW'],
                    zip: 20037
                }
            }, {
                name: {
                    first: 'Thomas',
                    last: 'Jefferson'
                },
                team: teamCollection[1]._id,
                address: {
                    lines: ['1600 Pennsylvania Avenue', 'White House'],
                    zip: 20500
                }
            }, {
                name: {
                    first: 'James',
                    last: 'Madison'
                },
                team: teamCollection[2]._id,
                address: {
                    lines: ['2 15th St NW', 'PO Box 8675309'],
                    zip: 20007
                }
            }, {
                name: {
                    first: 'James',
                    last: 'Monroe'
                },
                team: teamCollection[2]._id,
                address: {
                    lines: ['1850 West Basin Dr SW', 'Suite 210'],
                    zip: 20242
                }
            }], 
            function(error, data) {
                if (error) {
                    callback(error, null);
                } else {
                    console.info("employees successfully added!");
                    console.log(data);
                    callback(null, data);
                }
            });
        },
        function retrieveEmployeeViaId(data, callback) {
            let rnd = Math.floor((Math.random() * data.length) + 1);
            let id = 0;
            if (rnd >= 0 && rnd <= data.length) {
                id = data[rnd]._id;
            } 
            
            Employee.findOne( {_id: id}).populate('team').exec(function(error, result) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('----SINGLE EMPLOYEE RESULT--------');
                    console.log(result);
                    callback(null);
                }
            });
        },
        function nameUpdates(callback) {
            console.log("----UPDATING A DOCUMENT!----");
            series([
                function updateNames(cb) {
                    Employee.update({"name.first" : /John/i, "name.last" : /Adams/i}, {"name.first" : "Andrew", "name.last" : "Jackson"}, function(err, raw) {
                        if (err) {
                            console.error(err + " Sorry! Couldn't update Names!");
                        } else {
                            console.info("Names updated!");
                            cb(null);
                        }
                    });
                },
                function retrievenewName(cb) {
                    Employee.findOne({"name.first" : /Andrew/i}).populate('team').exec(function(err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.info("Returning the New Updated Names!");
                            console.log(result);
                            cb(null, result);
                        }
                    });
                }

            ], function(err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Updated & Retrieved a doc!");
                    callback(null);
                }
            }); 
        }

    ], function(err, results) {
        if (err) {
            console.error(err);
        } else {
            console.log("Database Activity Complete!");
            db.close();
            process.exit();
        }
    }); // end of async.waterfall(); 
});