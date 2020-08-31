const express = require("express");

const router = express.Router();

const PatientController = require("../controllers/patient");

router.post("", PatientController.patientPost);

router.get("", PatientController.patientGet);

router.get("/:id", PatientController.patientGetById);

module.exports = router;