
let mongoose = require("../node_modules/mongoose");
let async = require("../node_modules/async");


let Schema = mongoose.Schema;

let TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.Mixed]
    }
});


function _attachMembers(Employee, result, callback) {
    Employee.find({ team: result._id }, function(err, employees) {
        if (err) {
            return callback(err);
        } else {
            result.members = employees;
            callback(null, result.members);
        }
    });
}


TeamSchema.post("find", function(result, callback) {
    let Employee = mongoose.model("Employee");

    async.each(result, function(item, cb) {
        _attachMembers(Employee, item, cb);
    }, function(err) {
        if (err) {
            callback(err);
        }

        callback(null, result);
    });
});

TeamSchema.post("findOne", function(result, callback) {
    let Employee = mongoose.model("Employee");
    _attachMembers(Employee, result, callback);
});




module.exports = mongoose.model("Team", TeamSchema);






