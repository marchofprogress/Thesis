const express = require('express');
const bodyParser = require("body-parser"); //Node.js body parsing middleware.
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const mongoose = require('mongoose');
const path = require("path");
//CCtQ0UxS8T5FN4qQ
// mongo "mongodb+srv://cluster0-qwosx.mongodb.net/node-angular" --username Erik
mongoose.connect("mongodb+srv://Erik:CCtQ0UxS8T5FN4qQ@cluster0-qwosx.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(() => {
        console.log('Connection failed');
    });

const patientsRoutes = require("./routes/patient");
const diagnosticReportsRoutes = require("./routes/diagnosticReport");

const app = express();


app.use(bodyParser.json()); //parsing json data
// fájlok eléréhez kell, hogy a /diagnosticReportFiles útvonal elérhető legyen
app.use("/diagnosticReportFiles", express.static(path.join("backend/diagnosticReportFiles")));

//CORS error miatt kell(angular kliens nem éri el a server API-t)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
app.use("/api/patients", patientsRoutes);
app.use("/api/patients", diagnosticReportsRoutes);

module.exports = app;