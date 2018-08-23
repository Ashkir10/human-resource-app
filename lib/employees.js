
let mongoose = require("../node_modules/mongoose");
require('../models/employee');
require('../models/team');

let Employee = mongoose.model("Employee");
let Team = mongoose.model("Team");

exports.getEmployees = getEmployees;
exports.getEmployee = getEmployee;

function getEmployees(callback) {
    Employee.find().sort('name.last').exec(callback);
}

function getEmployee(employeeId, callback) {
    Employee.findOne({ id : employeeId}).exec(callback);
}