//***********************************************************************
//  
//  AUTHOR : Vishal Deshmukh
//  INFORMATION : .
//  DATE : 19-NOV-2018
//
//***********************************************************************

exports.dbconfig={
    mongodburi:"mongodb://vishal:vishal180189@ds125073.mlab.com:25073/battleapi",
    serverPort:8000
}
exports.serverConfig={
    serverPort:process.env.PORT || 5000
}

exports.tokenConfig = {
    secretKey:'SecretKey@123456',
    tokenExpiry:'60s'
}