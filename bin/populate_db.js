// file populate_db.js: populates the database with a set of data.

let mongoose = require("mongoose");
let async = require("../node_modules/async");
let { db, dbUrl } = require("../lib/connection");

let Employee = mongoose.model('Employee');
let Team = mongoose.model('Team');



let data = {
    employees: [
        {
            id: '1000003',
            name: {
                first: 'Colin',
                last: 'Ihrig'
            },
            image: 'images/employees/1000003.png',
            address: {
                lines: ['11 Wall Street'],
                city: 'New York',
                state: 'NY',
                zip: 10118
            }
        },

        {
            id: '1000021',
            name: {
              first: 'Adam',
              last: 'Bretz'
            },
            address: {
              lines: ['46 18th St', 'St. 210'],
              city: 'Pittsburgh',
              state: 'PA',
              zip: 15222
            }
        },

        {
            id: '1000022',
            name: {
                first: 'Matt',
                last: 'Liegey'
            },
            address: {
                lines: ['2 S Market Square', '(Market Square)'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15222
            }
        },

        {
            id: '1000025',
            name: {
              first: 'Aleksey',
              last: 'Smolenchuk'
            },
            image: 'images/employees/1000025.png' /* invalid image */,
            address: {
                lines: ['3803 Forbes Ave'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15213
            }
        },

        {
            id: '1000030',
            name: {
              first: 'Sarah',
              last: 'Gray'
            },
            address: {
                lines: ['8651 University Blvd'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15108
            }
        },

        {
            id: '1000031',
            name: {
              first: 'Dave',
              last: 'Beshero'
            },
            address: {
                lines: ['1539 Washington Rd'],
                city: 'Mt Lebanon',
                state: 'PA',
                zip: 15228
            }
        }

    ],

    // teams data.
    teams: [
        {
          name: 'Software and Services Group'
        },
        {
          name: 'Project Development'
        }
      ]
    
}


mongoose.connect(dbUrl, function(err) {

    if (err) {
        console.error("Problem communicating with database!" + err);
    }

    console.log("---------CONNECTED----------");

    async.waterfall([
        deleteEmployees,
        deleteTeams,
        addEmployees,
        addTeams,
        updateEmployeeTeams,
        seeEmployeeResults,
        seeTeamResults
    ], function(err, results) {
        if (err) {
            console.error(err);
        }
        // db.close();
        // process.exit();
        console.log('Done!');
    });
    
});




function deleteEmployees(callback) {
    Employee.deleteMany({}, function(err) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.info("Done deleting employees!");
            callback(null);
        }
    });
}

function deleteTeams(callback) {
    Team.deleteMany({}, function(err) {
        if (err) {
            callback(err);
        } else {
            console.info("Done deleting teams!");
            callback(null);
        }
    });
}

function addEmployees(callback) {
    Employee.create(data.employees, function(err, result) {
        if (err) {
            return callback(err);
        }

        console.info("Added Employees!");
        console.log(result);
        callback(null);
    });
}

function addTeams(callback) {
    Team.create(data.teams, function(err, result) {
        if (err) {
            return callback(err);
        }

        let teamdef = result[0]._id;

        console.info("Added Teams!");
        console.log(teamdef);
        callback(null, teamdef);
    });
}


function updateEmployeeTeams(teamdef_id, callback) {
    console.info("Updating teams with employees");
    console.log(teamdef_id);

    // set everyone to be on the same team to start.
    Employee.update({}, { team: teamdef_id }, { multi : true }, function(err, raw) {
        if (err) {
            return callback(err);
        }

        console.info("Done! updating employee teams.");
        console.log(raw);
        callback(null);
    });
}

function seeEmployeeResults(callback) {
    Employee.find({}, "team", function(err, result) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log(result);
            callback(null);
        }
    }); 
}

function seeTeamResults(callback) {
    Team.find({}, "members", function(err, result) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log(result);
            console.log(result[0].members);
            callback(null);
        }
    });
}