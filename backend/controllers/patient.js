const Patient = require('../models/patient');

exports.patientPost =  (req, res, next) => {
    // making a new js object type Patient, its connected to mongodb via mongoose schema
    const patient = new Patient({
        name: req.body.name,
        taj: req.body.taj,
        dateOfBirth: req.body.dateOfBirth
    });
    //saving to the db
    patient.save()
    .then(result => {
        res.status(201).json({
            message: 'Patient added successfully',
            patientId: result._id
        });;
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching patients failed!'
        });
    });
}

exports.patientGet = (req, res, next) => {
    Patient.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Patients fetched successfully!',
                patients: documents
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching patients failed!'
            });
        });
}

exports.patientGetById = (req, res, next) => {
    console.log('patientid patinet', req.params.id);
    Patient.findById(req.params.id)
        .then(patient => {
            if (patient) {
                res.status(200).json(patient);
            } else {
                res.status(404).json({ message: "Patient not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching patient failed!'
            });
        });
}