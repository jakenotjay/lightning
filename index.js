require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const strikeServer = require('./strikeServer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const app = express();

if (process.env.NODE_ENV == "production"){
  https.createServer({
    key: fs.readFileSync(process.env.servKey).toString(),
    cert: fs.readFileSync(process.env.servCert).toString()
  }, app).listen(443);
} else {
  var port = 5000;
  app.listen(port, ()=> console.log(`Listening on port ${port}`));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build'), {'index': ['/index.html']}));

console.log("Starting strike server")
strikeServer.start();

app.post('/api/checkUser', db.handleLogin);

app.post('/api/newUser', db.handleSignUp);

app.get('/api/authenticate', db.checkToken, (req, res) => {
  res.json({
    success: true,
  });
});

app.get('/api/reports', db.checkToken, (req, res) => {
  db.requestData('SELECT ReportID, DateTime, Location, Longitude, Latitude, Triangulated, TriangulateID FROM Reports AS ReportsData ORDER BY DateTime Desc LIMIT 10', [] ,(result) => {
    res.status(200).send({"ReportsData" : result});
  })
})

app.get('/api/readings', db.checkToken, (req, res) => {
  var reportID = req.query.reportID;
  db.requestData('SELECT Data AS ReadingData FROM Readings WHERE ReportID = ? ORDER BY ReadingID', [reportID], (result) => {
    res.status(200).send({"ReadingsData": result});
  })
});

app.get('/api/readingstxt', db.checkToken, (req, res) => {
  var reportID = req.query.reportID;
  var text = "";

  db.requestData('SELECT DateTime FROM Reports WHERE ReportID = ?', [reportID], (result) => {
    text += "t0="+result[0].DateTime+"\n";
    db.requestData('SELECT Data AS ReadingData FROM Readings WHERE ReportID = ? ORDER BY ReadingID', [reportID], (result) => {
      result.forEach(result => {
        text+=result.ReadingData+"\n";
      });
      res.status(200).send(text);
    });
  });
});

app.get('/api/readingscsv', db.checkToken, (req, res) => {
  var reportID = req.query.reportID;
  var text = "";

  db.requestData('SELECT DateTime FROM Reports WHERE ReportID = ?', [reportID], (result) => {
    text += "t0="+result[0].DateTime+"\n";
    db.requestData('SELECT Data AS ReadingData FROM Readings WHERE ReportID = ? ORDER BY ReadingID', [reportID], (result) => {
      result.forEach(result => {
        text+=result.ReadingData+",\n";
      });
      res.status(200).send(text);
    });
  });
});

app.get('/api/mapPoints', db.checkToken, (req, res) => {
  var reportID = req.query.reportID;
  db.requestData('SELECT ReportID, DateTime, Latitude, Longitude, Triangulated, TriangulateID FROM Reports WHERE ReportID = ?', [reportID], (result) => {
    if(result[0].Triangulated == true) {
      db.requestData('SELECT ReportID, DateTime, Latitude, Longitude FROM Reports WHERE TriangulateID = ? UNION ALL SELECT TriangulateID, DateTime, Latitude, Longitude FROM TriangulatedReports WHERE TriangulateID = ?',
      [result[0].TriangulateID, result[0].TriangulateID],
      (result1) => {
        res.status(200). send({"Locations": result1});
      });
    } else {
      res.status(200).send({"Locations": result});
    }
  });
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});