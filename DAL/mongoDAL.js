//***********************************************************************
//  
//  AUTHOR : Vishal Deshmukh
//  INFORMATION : This module will update the battle collection from csv to mlab's mongo DB.
//  DATE : 19-NOV-2018
//
//***********************************************************************

const mongoDB = require('mongoose');
const config = require('../Config/battleconfig');
const csvFile = require('csvtojson');
const Schema = mongoDB.Schema;

var dataSchema = {
    name : {type: String},
    year : {type: Number},
    battle_number : {type: Number},
    attacker_king : {type: String},
    defender_king : {type: String},
    attacker_1 : {type: String},
    attacker_2 : {type: String},
    attacker_3 : {type: String},
    attacker_4 : {type: String},
    defender_1 : {type: String},
    defender_2 : {type: String},
    defender_3 : {type: String},
    defender_4 : {type: String},
    attacker_outcome : {type: String},
    battle_type : {type: String},
    major_death : {type: Number},
    major_capture : {type: String},
    attacker_size : {type: Number},
    defender_size : {type: Number},
    attacker_commander : {type: String},
    defender_commander : {type: String},
    summer : {type: String},
    location : {type: String},
    region : {type: String},
    note : {type: String}
};

//Creating schema object
var battleSchema = new Schema(dataSchema);

//Assinging schema object to model and use model to add data to document.
const BattleAPI = mongoDB.model('BATTLEAPI',battleSchema);

//This method reads battle data from CSV file and uploads in MongoDB
async function UploadBattleDataToMongoDB(){
    mongoDB.connect(config.dbconfig.mongodburi,{ useNewUrlParser: true },async function(error){
        try{
            if(error) console.log(error);
            else
            {
                console.log('BattleAPI Mongo DB Connected !');
                //read battle json object from csv file
                const battleData = await csvFile().fromFile('DAL/battles.csv');

                console.log('Uploading data to remote MongoDB ...');
                for(i=0;i<battleData.length;i++)
                {
                    var tmpBattleDoc = new BattleAPI(battleData[i]);
                    tmpBattleDoc.save();
                }

                console.log('Uploaded data to remote MongoDB !');
            } 
        }
        catch(ex)
        {
            console.log(ex.message);
        }
    });
}


//This fucntion will truncate existing collection & re-populate battle data just to ensure uniqueness of data
async function DeleteCleanBattleData(){
    BattleAPI.collection.drop(function(){
        console.log('All existing collection dropped.');      
    });
    /*
        BattleAPI.find({},function(error,data){
            console.log('Found ' + data.length + ' records. Trying cleaning all records');
            for(i=0;i<data.length;i++)
            {
                var tmpBattleDoc = data[i];
                tmpBattleDoc.remove(function(error){
                    if(error) console.log('Error in cleaning records. Error :' + error);
                });
            }
            console.log('Cleaning records finished.');      
        });
    */
}


DeleteCleanBattleData();
UploadBattleDataToMongoDB();

module.exports = BattleAPI;
