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

const port = config.serverConfig.serverPort || 8081;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/count',(req,res)=>{
    battleAPI.getBattleCount(req,res);   
});

app.get('/list',(req,res)=>{
   battleAPI.getBattleList(req,res);    
});

app.get('/stats', (req,res)=>{
    battleAPI.getBattleStats(req,res);
});

app.get('/search', (req,res)=>{
    battleAPI.getBattleSearch(req,res);  
});

    res.send('Welcome to InstaRem Battle API');
});

app.listen(port, '0.0.0.0');
console.log("server started on port " + port);