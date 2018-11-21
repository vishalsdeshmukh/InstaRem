//***********************************************************************
//  
//  AUTHOR : Vishal Deshmukh
//  INFORMATION : .
//  DATE : 19-NOV-2018
//
//***********************************************************************

const express = require('express');
const bodyParser = require('body-parser');
const battleAPI = require('./ApiBL/APIUtils');
const config = require('./Config/battleconfig');
const jwt = require('jsonwebtoken');

const port = config.serverConfig.serverPort || 8081;

var app = express();

//Allowing Cross reference for data sharing.
app.use((req, res, next) =>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/count',ValidateToken,(req,res)=>{
    battleAPI.getBattleCount(req,res);   
});

app.get('/list',ValidateToken,(req,res)=>{
   battleAPI.getBattleList(req,res);    
});

app.get('/stats',ValidateToken, (req,res)=>{
    battleAPI.getBattleStats(req,res);
});

app.get('/search',ValidateToken, (req,res)=>{
    battleAPI.getBattleSearch(req,res);  
});

app.get('/',(req,res)=>{
    res.send('Welcome to InstaRem Battle API');
});

app.post('/login',(req,res)=>{
    //validate whether login is valid.
    //Application is hard-coded only for login=admin and password=admin only.
    var userCredentials = req.body;
    if(userCredentials.UserId != 'admin')
        res.send('Invalid User');
    else
    {
        jwt.sign({userCredentials},config.tokenConfig.secretKey,{expiresIn:config.tokenConfig.tokenExpiry},(err,token)=>{
            if(err) console.log(err.message);
            else{
                res.send('token valid for '+ config.tokenConfig.tokenExpiry+' : ' + token)
            }
        });
    }
});


//this function will validate token
function ValidateToken(req,res,next){
    //fetch token from header
    var token = req.headers['token'];
    if(typeof(token)=='undefined')
    {    
        res.sendStatus(403);
    }
    else{
        //TOKEN RECEIVED. invoke callback success
        jwt.verify(token,config.tokenConfig.secretKey,(err,data)=>{
            if(err) res.sendStatus(403);
            else{
                //token is valid. proceed for api call
                next();
            }
        });        
    }
}

app.listen(port, '0.0.0.0');
console.log("server started on port " + port);