const express = require("express");

const router = express.Router();

const DiagnosticReportController= require("../controllers/diagnosticReport");

const extractFile = require("../middleware/file");

router.post("/:id/diagnosticReports", extractFile , DiagnosticReportController.diagnosticReportPost);

router.get("/:id/diagnosticReports", DiagnosticReportController.getDiagnosticReports);

router.delete("/diagnosticReports/:dId", DiagnosticReportController.deleteDiagnosticReport);

module.exports = router;