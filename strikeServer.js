require('dotenv').config();
const net = require('net');
const mysql = require('mysql');
const notify = require('./notify.js');
var host = process.env.dbHost || 'localhost';
var insertUser = process.env.dbInsertUser || 'insertUser';
var insertpw = process.env.dbInsertPW || 'c5zUs$m2B#';
var schema = process.env.dbSchema || 'LIGHTNING';
var viewUser = process.env.dbViewUser || 'viewUser';
var viewpw = process.env.dbViewPW || '$%dw5Lx65U';

function start() {
    var server = net.createServer((socket) => {
        let chunks = [];
        socket.on('data', data => {
            chunks.push(data);
        }).on('end', () => {
            try{
                let data = Buffer.concat(chunks);
                var strikeData = JSON.parse(data.toString());
            } catch(e) {
                console.log(e);
            }
        
            checkSimilarReports(strikeData, (isSimilar, results) => {
                console.log(isSimilar);
                if (isSimilar){    
                    var similarData = results;
                    triangulateReport(strikeData, similarData);
                } else {
                    individualReport(strikeData);
                }
            })

            chunks = [];
        })
    }).listen(10337);
}

// This function is not complete, it only shows demo functionality 
function triangulateReport(strikeData, similarData){
    // triangulate position from strike data and the other two points (similarData)
    // call triangulisation.js once completed.
    
    var successfulTriangulisation = true;

    if(successfulTriangulisation){
        // This data would come from triangulisation.js not generated here (this if for demo purposes)
        var triangulationData = {
            dateTime: strikeData.dateTime,
            latitude: 51.243452,
            longitude: -0.590634
        }

        uploadUpdateTriangulatedData(triangulationData, strikeData, similarData);
        notify.notifyReport(strikeData, true);
    }
}

function uploadUpdateTriangulatedData(triangulationData, strikeData, similarData){
    try {
        var connection = mysql.createConnection({
            host: host,
            user: insertUser,
            password: insertpw,
            database: schema
        });

        connection.connect();
        
        // Upload triangulated report (must be done first for foreign key)
        connection.query({
            sql : 'INSERT INTO TriangulatedReports(DateTime, Latitude, Longitude) VALUES (?, ?, ?);', 
            values : [triangulationData.dateTime, triangulationData.latitude, triangulationData.longitude]
        }, (error, results, fields) => {
            if(error) throw error;
        });

        // Uploads the last strike item data
        connection.query({
            sql : 'INSERT INTO Reports (DateTime, Location, Longitude, Latitude, Triangulated, TriangulateID) VALUES(?, ?, ?, ?, ?, (SELECT TriangulateID FROM TriangulatedReports WHERE DateTime = ?));', 
            values : [strikeData.dateTime, strikeData.location, strikeData.longitude, strikeData.latitude, true, triangulationData.dateTime]
        }, (error, results, fields) => {
            if(error) throw error;
        });
        strikeData.readingData.forEach((dataItem) =>{
            connection.query({
                sql : 'INSERT INTO Readings(ReportID, Data) VALUES((SELECT ReportID FROM Reports WHERE DateTime = ?), ?);', 
                values : [strikeData.dateTime, dataItem]
            }, (error, results, fields) => {
                if(error) throw error;
            });
        });

        connection.query({
            sql: 'SELECT TriangulateID FROM TriangulatedReports WHERE DateTime = ?',
            values: [triangulationData.dateTime]
        }, (error, results, fields) => {
            var triangulateID = results[0].TriangulateID;
            
            similarData.forEach((item) => {
                connection.query({
                    sql : 'UPDATE Reports SET Triangulated = ?, TriangulateID = ? WHERE ReportID = ?', 
                    values : [true, triangulateID, item.ReportID]
                }, (error, results, fields) => {
                    if(error) throw error;
                    console.log("used id")
                });
            })

            connection.end();
        })




        
    } catch(e) {
        console.log(e);
    }
}

function individualReport(strikeData){
    try {
        uploadData(strikeData);
    } catch(e) {
        console.log(e);
    }
    notify.notifyReport(strikeData, false);
}

function checkSimilarReports(strikeData, callback) {
    var connection = mysql.createConnection({
        host: host,
        user: viewUser,
        password: viewpw,
        database: schema
    });

    connection.connect();

    var endDate = new Date(strikeData.dateTime);
    var beginDate = new Date(strikeData.dateTime);
    beginDate.setSeconds(beginDate.getSeconds() -3);

    connection.query({
        sql : 'SELECT ReportID, DateTime, Location, Latitude, Longitude FROM Reports WHERE DateTime BETWEEN ? AND ?',
        values: [beginDate, endDate]
    }, (error, results, fields) => {
        connection.end();
        if(results.length == 2){
            callback(true, results);
            return;
        } else {
            callback(false);
            return;
        }
    });
}
// replace this code with db.js insert
function uploadData(strikeData) {
    var connection = mysql.createConnection({
        host: host,
        user: insertUser,
        password: insertpw,
        database: schema
    });

    connection.connect();

    connection.query({
        sql : 'INSERT INTO Reports (DateTime, Location, Longitude, Latitude) VALUES(?, ?, ?, ?);', 
        values : [strikeData.dateTime, strikeData.location, strikeData.longitude, strikeData.latitude]
    }, (error, results, fields) => {
        if(error) throw error;
    });
    strikeData.readingData.forEach((dataItem) =>{
        connection.query({
            sql : 'INSERT INTO Readings(ReportID, Data) VALUES((SELECT ReportID FROM Reports WHERE DateTime = ?), ?);', 
            values : [strikeData.dateTime, dataItem]
        }, (error, results, fields) => {
            if(error) throw error;
        });
    });
    connection.end();
}

module.exports = {
    start : start
}