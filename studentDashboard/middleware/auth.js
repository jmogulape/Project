const jwt = require('jsonwebtoken');
const config = require('config');

//A middleware funciton is generally which has access to req and res
//objects and next is a callback to run so that it ll go to next
//middleware
module.exports = function(req,res,next){
    //Get token from header..when we send req to a protected route
    //we need to send it with header
    const token = req.header('x-auth-token');

    //check if no token
    if(!token) {
        return res.status(401).json({msg: "No token, auth denied"})
        //401 for not autherised error..above format is sending the msg
        //after giving status as 401 
    }

    //verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        console.log("decoded is::",decoded);
        req.user = decoded.user;
        next(); //this is default
    }catch(err){
        res.status(401).json({msg: "token isn't valid"})
    }
}