
let employeeDb = require("../database/employees");

exports.getEmployees = getEmployees;
exports.getEmployee = getEmployee;
exports.locateEmployee = locateEmployee;

function getEmployees(callback) {
    setTimeout(function() {
        callback(null, employeeDb);
    }, 500);
}

function getEmployee(employeeId, callback) {
    getEmployees(function(error, data) {
        if (error) {
            return callback(error);
        }

        let result = data.find(function(item) {
            return item.id === employeeId;
        });

        callback(null, result);
        
    });
}

function locateEmployee(employeeId, callback) {
    getEmployee(employeeId, function(error, data) {
        if (error) {
            return callback(error);
        }

        let result = employeeDb.indexOf(data);
        if (result === -1) {
            return callback(error);
        }

        return callback(null, result);
    });
}