const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = mongoose.Schema({
    name: { type: String, require: true},
    taj: { type: Number, require: true},
    dateOfBirth: { type: Date, require: true},
    diagnosticReports: [{
        type: Schema.Types.ObjectId,
        ref: 'diagnosticReports'
    }]

});

module.exports = mongoose.model('Patient', patientSchema);