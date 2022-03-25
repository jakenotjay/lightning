const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config.js');
const saltRounds = 10;
var host = process.env.dbHost || 'localhost';
var insertUser = process.env.dbInsertUser || 'insertUser';
var insertpw = process.env.dbInsertPW || 'c5zUs$m2B#';
var schema = process.env.dbSchema || 'LIGHTNING';
var viewUser = process.env.dbViewUser || 'viewUser';
var viewpw = process.env.dbViewPW || '$%dw5Lx65U';


const requestData = (query, values, callback) => {
    var connection = mysql.createConnection({
      host: host,
      user: viewUser,
      password: viewpw,
      database: schema
    });
    
    connection.connect();
  
    connection.query({
      sql : query,
      values : values,
    }, (error, results, fields )=> {
      if(error) throw error;
      callback(results);
      connection.end();
    });
}

const insertData = (query, values, callback) => {
    var connection = mysql.createConnection({
        host: host,
        user: insertUser,
        password: insertpw,
        database: schema
    });

    connection.connect();

    connection.query({
        sql : query, 
        values : values,
    }, (error, results, fields) => {
        if(error) throw error;
        callback(results);
        connection.end();
    });
}


const newUser = (userData, callback) => {
    requestData('SELECT UserID FROM UserData WHERE Email = ?', userData.email, (results) => {
        if(results.length > 0) {
            callback(false, "User already exists");
        } else {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(userData.password, salt, (err, hash) => {
                    insertData(
                        'INSERT INTO UserData (Email, Hash, PhoneNumber) VALUES (?, ?, ?)',
                        [userData.email, hash, userData.phoneNumber],
                        (results) => {
                            callback(true, "New account created");
                        }
                    )
                });
            });
        }
    })
}

const checkUser = (userData, callback) => {
    requestData('SELECT Hash, ApprovedStatus FROM UserData WHERE Email = ?', userData.email, (results) => {
        if(results.length < 1) {
            callback(false, "An account with this email does not exist, please sign up");
        } else if(results[0].ApprovedStatus){
            bcrypt.compare(userData.password, results[0].Hash.toString(), (err, res) => {
                if(res) {
                    callback(true, "Login successful");
                } else {
                    callback(false, "Invalid login details");
                }
            });
        } else {
            callback(false, "Your account is not approved, please contact an administrator");
        }
    });
}

const checkToken = (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            res.json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Auth token is not supplied'
        });
      }
}

const handleLogin = (req, res) => {
    var userData = {
        email : req.body.email,
        password : req.body.password
    }
  
    checkUser(userData, (result, reason) => {
        if(result) {
            let token = jwt.sign(
                {email: userData.email}, 
                config.secret,
                {expiresIn: '1h'}
            );

            if (req.cookies.token === undefined){
                res.cookie(
                    'token', 
                    token, 
                    {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true, 
                        //secure: true made to true as soon as https enabled
                    }
                );
            } else {
                res.clearCookie(
                    'token', 
                    token, 
                    {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true, 
                        //secure: true made to true as soon as https enabled
                    }
                );
                res.cookie(
                    'token', 
                    token, 
                    {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true, 
                        //secure: true made to true as soon as https enabled
                    }
                );
            }

            res.json({
                success: true,
                reason: reason
            });
        } else {
            res.json({
                success: false,
                reason: reason
            });
        }
    })
} 

const handleSignUp = (req, res) => {
    var userData = {
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
    }

    newUser(userData, (success, reason) => {
        res.json({
            success: success,
            reason: reason
        });
    })
}

module.exports = {
    requestData : requestData,
    insertData : insertData,
    handleLogin : handleLogin,
    handleSignUp : handleSignUp,
    checkToken : checkToken
}