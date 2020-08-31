const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosticReportSchema = mongoose.Schema({
    name: { type: String, require: true},
    filePath: { type: String, require: true},
    uploaded: {type: Date, require: true},
    comment: {type: String},
    content: [{
        name: String,
        value: String,
        prob: String,
        unit: String,
        ref: String
    }],
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'patient'
    }

});

module.exports = mongoose.model('DiagnosticReport', diagnosticReportSchema);