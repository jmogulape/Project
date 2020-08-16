const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User')
const {check, validationResult} = require('express-validator/check');
const config = require('config')
//encrypt password 
const bcrypt = require('bcryptjs');
//jsonwebtoken
const jwt = require('jsonwebtoken');

//@route  GET api/auth
//@desc   Test route
//@access Public
//here auth as 2nd arg is added to use middleware 
router.get('/',auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');//out model user returns promise
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    res.send('Auth route')
});

//@route  POST api/users
//@desc   Register user
//@access Public
router.post('/',[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please give your password').isEmpty()
],async (req,res)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    console.log("req.body is::",req.body);
    const {name, password} = req.body;

    try{
        //see if user exists
        //findOne is a async method which returns a promise
        let user = await User.findOne({name});
        if(!user){
            return res.status(400).json({error: [{msg: 'Invalid Credentials'}]});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({error: [{msg: 'Invalid Credentials'}]});
        }
        const payload = {
            user:{
                id: user.id //same as _id in mongodbatlas
            }
        };
        jwt.sign(payload, config.get('jwtsecret'),
            {expiresIn: 36000},(err,token)=>{
                if(err) throw err;
                res.json({token})
        });  
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

    //res.send('User route')
});

module.exports = router;