const battleAPI = require('../DAL/mongoDAL');


async function battleTypes(){ 
    try{
        return new Promise(function(resolve,reject){battleAPI.distinct('battle_type', { "battle_type": { $nin: ["", null] }},function(error,data){
            if(error) reject(error)
            else resolve(data);
        });
        });
    }
    catch(ex){
        console.log(ex.message);
    }
}

async function attackerOutcome(fieldName){ 
    try{
        return new Promise(function(resolve,reject){
            battleAPI.aggregate([
                {
                    "$group": {
                        "_id": "$attacker_outcome",
                        "count": { "$sum": 1 }
                    }
                }
            ],function(error,data){
            if(error) reject(error)
            else {
                var attackerOutcomeData = {};
                    if(data.length > 0)
                    {
                        data.forEach((element) =>{
                            if(element._id == "loss" || element._id == "win")
                            {
                                attackerOutcomeData[element._id] = element.count;
                            }
                        });
                    }                
                    resolve(attackerOutcomeData);
            }
        });
    });
    }
    catch(ex){
        console.log(ex.message);
    }
}


async function battleDefenderSize(){ 
    try{
        return new Promise(function(resolve,reject){
            battleAPI.aggregate([
                {
                    "$group": {
                        "_id": null,
                        "max": { "$max": "$defender_size" },
                        "min": { "$min": "$defender_size" },
                        "avg": { "$avg": "$defender_size" }
                    }
                }
            ],function(error,data){
            if(error) reject(error)
            else resolve(data);
        });
        });
    }
    catch(ex){
        console.log(ex.message);
    }
}


async function mostActive(fieldName){ 
    try{
    return new Promise(function(resolve,reject){
        battleAPI.aggregate([
            {$group: { _id: '$'+ fieldName,count:{$sum:-1} }},
            {$sort:{'count':1}},
            {$limit:1}
    ],function(error,data){
        if(error) reject(error)
        else resolve(data);
    });
    });
    }
    catch(ex){
        console.log(ex.message);
    }
}



var battleUtils = {
    getBattleCount(req,res){
        battleAPI.collection.countDocuments(function(err,count){
            if(err) res.send('Error:'+err.message + ',Stack :' + err.stack);
            else res.send('Total battle count : '+count);
        });
    },
    getBattleList(req,res){
        battleAPI.find().distinct('location',function(err,data){
            if(err) res.send('Error:'+err.message + ',Stack :' + err.stack);
            else res.send(data);
        });
    },
    getBattleSearch(req,res){
        var andQuery = {};
        var orQuery = {};

        andQuery.$and = [];
        orQuery.$or = [];

        for (key in req.query)
        {
            switch(key){
                case "king":{
                    orQuery.$or.push({attacker_king:req.query[key]});
                    orQuery.$or.push({defender_king:req.query[key]});
                    andQuery.$and.push(orQuery);
                }  
                break;
                default :{
                    var tmpObj = {};
                    tmpObj[key]=req.query[key];
                    andQuery.$and.push(tmpObj);
                }    
            }          
        }

        if(andQuery.$and.length > 0)
        {
            battleAPI.distinct('name',andQuery,function(err,data){
                if(err) res.send('Error:'+err.message + ',Stack :' + err.stack);
                else res.send(data);
                }
            );
        }
        else
        {
            res.send('Enter search query to fetch data');
        }
    },
    async getBattleStats(req,res){

        var objBattleStats = {};

        await attackerOutcome().then(function(data){
            objBattleStats['attacker_outcome'] = data;
        }).catch(function(err){
            objBattleStats['attacker_outcome'] = err.message;
        });
        
        
        await battleTypes().then(function(data){
            objBattleStats['battle-type'] = data;
        }).catch(function(err){
            objBattleStats['battle-type'] = err.message;
        });

        await battleDefenderSize().then(function(data){
            objBattleStats['defender_size'] = data;
        }).catch(function(err){
            objBattleStats['defender_size'] = err.message;
        });

        objBattleStats['most_active'] = {};
        await mostActive('attacker_king').then(function(data){
            objBattleStats['most_active']['attacker_king'] = data[0]._id;
        }).catch(function(err){
            objBattleStats['most_active']['attacker_king'] = err.message;
        });

        await mostActive('defender_king').then(function(data){
            objBattleStats['most_active']['defender_king'] = data[0]._id;
        }).catch(function(err){
            objBattleStats['most_active']['defender_king'] = err.message;
        });

        await mostActive('region').then(function(data){
            objBattleStats['most_active']['region'] = data[0]._id;
        }).catch(function(err){
            objBattleStats['most_active']['region'] = err.message;
        });

        await mostActive('name').then(function(data){
            objBattleStats['most_active']['name'] = data[0]._id;
        }).catch(function(err){
            objBattleStats['most_active']['name'] = err.message;
        });

        res.send(objBattleStats);
    }
    
}

module.exports = battleUtils;