var pdfreader = require("pdfreader");
var fs = require('fs');
const Diagnosticreport = require('../models/diagnosticreport');
const Patient = require('../models/patient');

exports.diagnosticReportPost = (req, res, next) => {

    var rows = {}; // indexed by y-position
    var extractedData = [];
    var uploadTime = Date.now();
    // a timeStr az egyedi column nevek miatt kell, ami órát és percet fűz a vizsgálati dátumhoz
    var h = new Date();
    var hour = h.getHours();
    var m = new Date();
    var minutes = m.getMinutes();
    var timeStr='. '+hour+':'+minutes;
    
    var legalNames = [
        'Vizelet nitrit',
        'Vizelet ph',
        'Vizelet fehérje',
        'Vizelet cukor',
        'Vizelet ketontest',
        'Vizelet urobilinogén',
        'Vizelet bilirubin',
        'Vizelet fehérvérsejt',
        'Vizelet vörösvérsejt',
        'Vas',
        'Teljes vaskötő kapacitás',
        'Transzferin',
        'Transzferin szatuáció',
        'Fehérvérsejt szám',
        'Neutrophil gran.',
        'Neutrophil gran. %',
        'Lymphocyta',
        'Lymphocyta %',
        'Monocyta',
        'Monocyta %',
        'Eosinophil',
        'Eosinophil %',
        'Basophil',
        'Basophil %',
        'Vörösvértestszám',
        'Haemoglobin',
        'Hematokrit',
        'MCV',
        'MCH',
        'MCHC',
        'RDW-CV',
        'Thrombocyta szám',
        'MPV',
        'Nátrium',
        'Kálium',
        'Klorid',
        'Bikarbonát',
        'Kalcium',
        'Korrigált Kalcium',
        'Magnézium',
        'Foszfát',
        'Glükóz',
        'Haemoglobin A1C',
        'Összfehérje',
        'Albumin',
        'Koleszterin',
        'Triglicerid',
        'HDL-koleszterin',
        'LDL-koleszterin',
        'Szenzitív C-reaktív protein',
        'Aszpartát-aminotranszferáz (GOT)',
        'Alanin-aminotranszferáz (GPT)',
        'Alkalikus foszfatáz (ALP)',
        'Gamma-glutamil transzferáz (GGT)',
        'Össz bilirubin',
        'Alfa-amiláz',
        'Karbamid (Urea)',
        'Kreatinin',
        'Vizelet kreatinin',
    //    'eGFR-EPI',
        'Húgysav',
        'Vizelet összfehérje',
    //    'Vizelet albumin'
    ]
    
    function printRows() {
      Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach((y) => {
            if(rows[y][2]!='A' && rows[y][2]!='M'){
                rows[y][4]= rows[y][3];
                rows[y][3]=rows[y][2];
                rows[y][2]="";
            }
            var o ={ 
                name : rows[y][0],
                value : rows[y][1],
                prob : rows[y][2],
                unit : rows[y][3],
                ref : rows[y][4]
    
            }
            console.log(o);
            var keys = Object.keys(o);
            for(var i=0; i<keys.length; i++){
                if(o[keys[i]]=='Vizsg.i.:'){
                    uploadTime = o[keys[i+1]]+timeStr;
                } 
            }
    
            for(var i =0; i< legalNames.length; i++){
                if(o.name == legalNames[i]){
                    extractedData.push(o);
                }
            }
        });
    }
     
      var imgPath = "./backend/diagnosticReportFiles/" + req.file.filename;
      console.log(imgPath);
      new pdfreader.PdfReader().parseFileItems(imgPath, function(err, item){
      if (!item || item.page) {
        printRows();
        rows = {}; // clear rows for next page
      }
      else if (item.text) {
        // accumulate text items into rows object, per line
        (rows[item.y] = rows[item.y] || []).push(item.text);
      }
        });

        if(extractedData==null){
            res.status(500).json({
                message: 'No useful data in pdf'
            });
        }
            setTimeout(() => {
                console.log(req.params.id);
                Patient.findById(req.params.id).then(patient => {  //páciens megtalálása
                    if (patient) {
                        const url = req.protocol + '://' + req.get("host");
                        const diagnosticreport = new Diagnosticreport({  //diagnosticreport létrehozása
                            name: req.body.name,
                            comment: req.body.comment,
                            content: extractedData,
                            uploaded: uploadTime,
                            filePath: url + '/diagnosticReportFiles/' + req.file.filename
                        });
                        diagnosticreport.patient = patient; //relationship hozzáadása
                        diagnosticreport.save()
                            .then(result => {
                            patient.diagnosticReports.push(result);
                            patient.save()
                                .then(() => {
                                    res.status(201).json({
                                        message: 'Diagnosticreport added successfully',
                                        diagnosticReport: {
                                            id:  result._id,
                                            name: result.name,
                                            uploaded: result.uploaded,
                                            comment: result.comment,
                                            content: result.content,
                                            filePath: result.filePath
                                        }
                                    });
                                })
                            })
                        .catch(err => {
                            next(err);
                        });
                        } else {
                        res.status(404).json({ message: "Patient not found!" });
                        }
                    });
                }, 3000);
                }

exports.getDiagnosticReports=(req, res, next) => {
    Patient.findById(req.params.id).populate({path: 'diagnosticReports', model: Diagnosticreport})
    .then(patient => {
        if (patient) {
          res.status(200).json({
              message: 'Diagnosticreports fetched successfully!',
              diagnosticReports: patient.diagnosticReports});
        } else {
          res.status(404).json({ message: "DiagnosticReports not found!" });
        }
      })
    .catch(err => {
        next(err);
    });
}

exports.deleteDiagnosticReport = async (req, res, next) => {
    const id = req.params.dId;

    const diagnosticReport = await Diagnosticreport.findById(id);

    const patientId  = diagnosticReport.patient;
    const file = diagnosticReport.filePath;
    console.log(file);

    var pos = file.search("diagnosticReportFiles");
    var subs = file.substring(pos-1);

    const patient = await Patient.findById(patientId);
    //a diagreport törlése
    await diagnosticReport.remove();
    //backend/diagnosticReportFiles mappából törlés
    await fs.unlinkSync('backend'+subs);

    //páciens kapcsolatából is kivesszük
    patient.diagnosticReports.pull(diagnosticReport);

    await patient.save();

    res.status(200).json({
        message: 'DiagnosticReport deleted successfully!'
    });
  }