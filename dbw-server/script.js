const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const cpath = './public/data/uploads/';
const tpath = './public/data/temp/';
const bcrypt = require('bcrypt');
const pool = require('./db');
const multer = require('multer');
const cors = require('cors');
const request = require('request');
var Cookie = require('request-cookies').Cookie;
const { resolve } = require('path');
const https = require('https');
const axios = require('axios');
var app = express();
//these are some middleware for cross-origin support
app.use(cors());
app.use(bodyParser.json());



// module.exports = function getAuthKey() {
    var authSessionCookie = null;

    https.get('https://www.tu-chemnitz.de/informatik/DVS/blocklist', (res) => {
      const u1 = res.headers.location;
    
      // ======================lvl 2=
      https.get(u1, (res2) => {
        req2Head = JSON.parse(JSON.stringify(res2.headers));
        _saml_sp = req2Head['set-cookie'][0].split(';')[0];
    
        //========================== lvl 3
        let u2 = new URL(u1);
        axios
          .post(u2.href, 'user_idp=https%3A%2F%2Fwtc.tu-chemnitz.de%2Fshibboleth')
          .then(u2Res => { })
          .catch(error => {
            var u3 = new URL(error.request.res.responseUrl);
    
            // ===================================== lvl 4
            https.get(u3.href, (u3Res) => {
              u3Res.on('data', function (chunk) {
                var u4 = chunk.toString().split("f=\"")[1].split("\">")[0];
                var u4Cookie = u3Res.headers['set-cookie'].toString().split(';')[0];
    
                // ================================== lvl 5
                request({
                  url: u4.trim(),
                  //qs: 'jsonData',
                  method: 'GET',
                  headers: { 'Cookie': u4Cookie + '; ' + _saml_sp }
                }, function (error, response, body) {
    
                  u5 = body.match(/https:\/\/wtc.tu-chemnitz.de\/krb\/module.php\/TUC\/username.php[^"]*/gm)[0];
    
                  // ================================== lvl 6
    
                  request({
                    url: u5.trim(),
                    method: 'GET',
                    headers: { 'Cookie': u4Cookie + '; ' + _saml_sp }
                  },
                    function (error, response, body) { });
    
                  request({
                    url: u5.split('?')[0].trim(),
                    method: 'POST',
                    body: 'username=somro&AuthState=' + u5.trim().split('AuthState=')[1].split('&amp;')[0],
                    headers: {
                      'Cookie': u4Cookie + '; ' + _saml_sp,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                  },
                    function (error, response, body) {
    
                      var u6 = response.headers.location;
                      // ================================== lvl 7
                      request({
                        url: u6.trim(),
                        method: 'GET',
                        headers: { 'Cookie': u4Cookie + '; ' + _saml_sp }
                      },
                        function (error, response, body) {
                          var u7 = body.match(/https:\/\/wtc.tu-chemnitz.de\/krb\/module.php\/core\/loginuserpass.php[^"]*/g)[0];
    
                          // ================================== lvl 8
                          request({
                            url: u7.trim(),
                            method: 'GET',
                            headers: { 'Cookie': u4Cookie + '; ' + _saml_sp }
                          },
                            function (error, response, body) { });
    
                          request({
                            url: u7.trim(),
                            method: 'POST',
                            body: 'password=456Mansoor123!&AuthState=' + u5.trim().split('AuthState=')[1].split('&amp;')[0],
                            headers: {
                              'Cookie': u4Cookie + '; ' + _saml_sp,
                              'Content-Type': 'application/x-www-form-urlencoded'
                            }
                          },
                            function (error, response, body) {
    
                              //console.log(JSON.parse(JSON.stringify(response.headers))['set-cookie']); //<----------------------------------------------------------------------------------------------- ShibAuthToken tocken here
                              var SAMLResponse = response.body.match(/value="[^"]*/g)[0].split('="')[1].replace(/\+/g,'%2B');
                              var RelayState = response.body.match(/value="[^"]*/g)[1].split('="')[1].replace(/\:/g,'%3A');
                              // console.log('id', RelayState);
                              //console.log('key',SAMLResponse);
                              //console.log('---> ',u4Cookie + '; ' + _saml_sp)
    
    
                              // ================================== final call
                              request({
                                url: 'https://www.tu-chemnitz.de/Shibboleth.sso/SAML2/POST',
                                method: 'POST',
                                body: 'SAMLResponse='+SAMLResponse+'&RelayState=' + RelayState,
                                headers: {
                                  //'Cookie': u4Cookie + '; ' + _saml_sp,
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                  'User-Agent': 'PostmanRuntime/7.29.0',
                                  'Accept': '*/*',
                                  'Accept-Encoding': 'gzip, deflate, br',
                                  'Connection': 'keep-alive'
                                }
                              },
                                function (error, response, body) {
    
                                  //console.log(JSON.parse(JSON.stringify(response.headers))['set-cookie']); //<----------------------------------------------------------------------------------------------- ShibAuthToken tocken here
                                  //console.log('id',RelayState);
                                  //console.log('key',SAMLResponse);
                                  //console.log('---> ','SAMLResponse='+SAMLResponse+'&RelayState=' + RelayState);
                                    // <----------------------------------------------------- this will work
                                  authSessionCookie = response.headers['set-cookie'];
                                  authSessionCookie = authSessionCookie[0].split(";");
                                  authSessionCookie = authSessionCookie[0];
                                  console.log(authSessionCookie);
                                });
                              //=========================== final call end
                            });
                          // =================================== lvl 8 end
                        });
                      // =================================== lvl 7 end
                    });
                  // =================================== lvl 6 end
                });
                // =================================== lvl 5 end
              });
            });
            // ===================================== lvl 4 end
          });
        //========================== lvl 3 end
      }).on('error', (e) => {
        //console.error(e);
      });
    
      res.on('data', (d) => {
        //process.stdout.write(d);
      });
    
    }).on('error', (e) => {
      //console.error(e);
    });
    
    




//! Use of Multer
//Multer is Multipart-formdata Handler which helps us upload the datafiles to the server
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        console.log("------", req.files);
        callBack(null, cpath)     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        console.log("=====>>>",file)
        var date = new Date();
        const hash = crypto.createHash('sha256').update(file.originalname + date.getTime()).digest('hex');
        callBack(null, hash);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});


//Middleware that tells our back-end app to run on a specified port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


//This API will upload the file onto the server
app.post('/stats', upload.single('uploaded_file'), function (req, res) {
    console.log(req.file);
    const { user_id, user_name } = req.body;
    var query = "INSERT INTO uploads (file_hash, file_name, file_size, owner_id, owner_name, upload_time, blocked_status) values ($1, $2, $3, $4, $5, $6, $7)"
        values = {

            file_name: req.file.originalname,
            file: null,
            hash: req.file.filename

        };
    var content = req.file.buffer;
    pool.query(query, [req.file.filename, req.file.originalname, (req.file.size/1024) ,user_id,user_name, new Date(), 'FALSE'],function (err, data) {
        if (!err)
            console.log("file saved in database successfully");
    })
    res.send(req.file.filename);
});



//This API downloads the file from the server
app.get('/load', async function (req, res) {
    console.log(req.query.file);
    const hash = req.query.file;
    const from = cpath + hash;
    var fileName;

    pool.query('SELECT * FROM uploads WHERE file_hash=$1', [hash], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            fileName = rows.rows[0].file_name;
            console.log(from, fileName);
            downloadFile(res,from,fileName);
        }

        else
            console.log(err);


    })

});


//This specific function is a helper function for downloading files from the server(files that are already uploaded on the server can be downloaded)
async function downloadFile(res, from, fileName) {
    //res.setHeader('Content-disposition', 'attachment; filename=');
    //res.setHeader('Keep-Alive', 'timeout=100');
    console.log("from download ", fileName);
    res.download(
        from,
        fileName, // Remember to include file extension
        (err) => {
            if (err) {
                res.send({
                    error: err,
                    msg: "Problem downloading the file"
                })
            }
        });

}



//This API check the usercredentials are valid(user that is trying to logged into the service is Registered user).
app.post('/login', async (req, res)=> {
    const potentialLogin = await pool.query("SELECT user_id, username, passhash FROM users WHERE username=$1", [req.body.username]);
    if(potentialLogin.rowCount > 0){
        //found user
        const isSamePassword = await bcrypt.compare(req.body.password, potentialLogin.rows[0].passhash);
        if(isSamePassword) {
            //login
            
            res.send({loggedIn: true, status: "Successfully LoggedIn", user_id:potentialLogin.rows[0].user_id, username:potentialLogin.rows[0].username});
        }   
        else{
            //not good login
            res.send({loggedIn: false, status: "wrong username or password"});
        }
    }else{
        res.send({loggedIn: false, status: "wrong username or password"});
    }
   

  
})


//This API registers the user
app.post('/signup', async (req, res)=> {
    const { username, password } = req.body
    console.log(username,"----",password)
    const existingUser = await pool.query("SELECT username FROM users WHERE username=$1", [username]);
    if(existingUser.rowCount === 0){
        //register new users    
        const hashedPass = await bcrypt.hash(password, 10);
        const newUserQuery = await pool.query("INSERT INTO users (username, passhash) values ($1, $2) RETURNING username", [username, hashedPass]);
        const gettingUser = await pool.query("SELECT user_id, username FROM users WHERE username=$1", [username])
        res.send({loggedIn: true, user_id:gettingUser.rows[0].user_id, username:gettingUser.rows[0].username})
    }else{
        res.send({ loggedIn:false, status: 'Username Already Taken'});
    }
})


//This is the API request that gets all file from the DB that are uploaded.
app.get('/getallfiles', async (req,res) => {
    await pool.query("SELECT * FROM uploads",(err, rows, files) => {
        if(!err){
            res.send(rows)
        }
    })
})


//This is API request for getting files uploaded by a specific(loggedIn) user from the DB.
app.post('/myfiles', async (req,res) => {
    await pool.query("SELECT * FROM uploads WHERE owner_id=$1",[req.body.user_id], (err, rows, fields)=> {
        if(!err){
            res.send(rows);
        }
    })
})


//Work in progress on This API
//This is the 3rd party integration (Blocklist web App) Api, which helps us check that if a specified file related to a specified hash is blocked or not 

app.post('/wtcblockfile', async (req, res) => {
    console.log(authSessionCookie);
    const { filehash } = req.body;

    request.get(`https://www.tu-chemnitz.de/informatik/DVS/blocklist/${filehash}`, {
        headers:{
            "Cookie": `WTC_AUTHENTICATED=somro; ${authSessionCookie}`,
            "Access-Control-Allow-Origin":"*",
        }
    }, function(error, response, body){
        if(response.statusCode === 210){
           res.send("File already Blocked");
           return;
        }
    })

    request.put(`https://www.tu-chemnitz.de/informatik/DVS/blocklist/${filehash}`, {
        headers:{
            "Cookie": `WTC_AUTHENTICATED=somro; ${authSessionCookie}`,
            "Access-Control-Allow-Origin":"*",
        }
    }, function(error, response, body){
        console.log(response.statusCode)
        if(response.statusCode === 201){
            pool.query("UPDATE uploads SET blocked_status = $1 WHERE file_hash = $2", ['TRUE' ,filehash], (err, rows, fields) => {
                if(!err){
                    console.log("FILE STATUS UPDATED");
                }
            });
        }
    })
})


app.post('/wtccheck', async (req, res) => {
    console.log(authSessionCookie);
    const { filehash } = req.body;
    request.get(`https://www.tu-chemnitz.de/informatik/DVS/blocklist/${filehash}`, {
        headers:{
            "Cookie": `WTC_AUTHENTICATED=somro; ${authSessionCookie}`,
            "Access-Control-Allow-Origin":"*",
        }
    }, function(error, response, body){
        res.send(response);
    })
})

app.post('/wtcremove', async (req, res) => {
    console.log(authSessionCookie);
    const { filehash } = req.body;

    request.get(`https://www.tu-chemnitz.de/informatik/DVS/blocklist/${filehash}`, {
        headers:{
            "Cookie": `WTC_AUTHENTICATED=somro; ${authSessionCookie}`,
            "Access-Control-Allow-Origin":"*",
        }
    }, function(error, response, body){

        if(response.statusCode === 200){
            res.send("This file is not blocked");
            return;
        }
    })
    
    request.delete(`https://www.tu-chemnitz.de/informatik/DVS/blocklist/${filehash}`, {
        headers:{
            "Cookie": `WTC_AUTHENTICATED=somro; ${authSessionCookie}`,
            "Access-Control-Allow-Origin":"*",
        }
    }, function(error, response, body){

        if(response.statusCode === 204){
            pool.query("UPDATE uploads SET blocked_status = $1 WHERE file_hash = $2", ['FALSE', filehash], (err, rows, fields) => {
                if(!err){
                    console.log("FILE STATUS UPDATED");
                }
            });
        }
        res.send(response);
    })
})





app.post('/blockfile', async (req, res)=>{
    const {filename, filehash, ownerid, ownername } = req.body;

    const recordExist = await pool.query("SELECT * FROM blockedfiles WHERE blocked_file_hash = $1", [filehash]);

    console.log(recordExist.rowCount)
    if(recordExist.rowCount > 0){
        console.log("File is already blocked");
        res.send("File is already Blocked");
        return;
    }

    console.log(filename)
     pool.query("UPDATE uploads SET blocked_status = $1 WHERE file_hash = $2", ['TRUE' ,filehash], (err, rows, fields) => {
        if(!err){
    
        }
    });

    pool.query("INSERT INTO blockedfiles (blocked_file_name, blocked_file_hash, file_owner_id, file_owner_name) VALUES ($1,$2,$3,$4)", [filename, filehash, ownerid, ownername], (err, rows, fields)=>{
        if(!err){
            console.log("file Blocked Successfully");
            res.send("file blocked")
        }
    })
    
})

//USer request for unblocking file
app.post('/requestunblock', async (req, res) => {
    const { userid, username, filename, ownerId, ownername } = req.body;

     pool.query("INSERT INTO requests (requested_user_id, requested_user_name, requested_file_name, file_owner_id, file_owner_name) VALUES($1, $2, $3, $4, $5)", [userid, username, filename, ownerId, ownername], (err, rows, fields) => {
        if(!err){
            console.log("File request received")
            res.send("File Unblock request Sent to the owner");
        }
    })

})

app.post('/unblockfile', async (req, res)=>{
    const {filename, filehash, ownerid, ownername } = req.body;

    const recordExist = await pool.query("SELECT * FROM blockedfiles WHERE blocked_file_hash = $1", [filehash]);

    if(recordExist.rowCount === 0){
        console.log("File is already unblocked");
        res.send("File is already unBlocked");
        return;
    }

     pool.query("UPDATE uploads SET blocked_status = $1 WHERE file_hash = $2", ['FALSE' ,filehash], (err, rows, fields) => {
        if(!err){
    
        }
    });

    pool.query("DELETE FROM blockedfiles WHERE blocked_file_hash = $1", [filehash], (err, rows, fields)=>{
        if(!err){
            console.log("file unBlocked Successfully");
            res.send("file unBlocked")
        }
    })
    
})


app.post('/myrequests', async (req,res) => {
    await pool.query("SELECT * FROM requests WHERE owner_id=$1",[req.body.user_id], (err, rows, fields)=> {
        if(!err){
            res.send(rows);
        }
    })
})