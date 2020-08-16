const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const config = require('config')
//bring user model 
const User = require('../../models/User')
//to bring gravatar
const gravatar = require('gravatar');
//encrypt password 
const bcrypt = require('bcryptjs');
//jsonwebtoken
const jwt = require('jsonwebtoken');
//@route  POST api/users
//@desc   Register user
//@access Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more chars').isLength({min: 6})
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    console.log("req.body is::",req.body);
    const {name, email, password,age,cgpa,chem,gender,math,phy} = req.body;

    try{
        //see if user exists
        //findOne is a async method which returns a promise
        let user = await User.findOne({name});
        /*if(user){
            return res.status(400).json({error: [{msg: 'User already exists'}]});
        }*/
        //get users gravatar
        const avatar = gravatar.url(name,{
            s: '200', //size 
            r: 'pg', //rating 
            d: 'mm' //default user icon
        });
        user = new User({
            name,
            email,
            avatar,password,
            age,cgpa,chem,gender,math,phy
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);//hash tag to encrypt
        await user.save();
        //Return jsonwebtoken once user is registered
        //res.send('User registered');
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

router.get('/',async (req,res)=>{
    try{
        //see if user exists
        //findOne is a async method which returns a promise
        const {name, email, password} = req.body;
        let user = await User.find();
        console.log("user is:::",user)
        if(user){
            return res.status(200).send(user);
        }
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;