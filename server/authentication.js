const express = require('express');
const router = express.Router();
const User = require('../database/models/User')
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');


const generateToken = async(userData)=> {
    const newSignature = randtoken.uid(256);
    // userData.authSignature = newSignature;
    try{
        // let updateData = await User.findByIdAndUpdate(userData._id, { $set: userData})
        let updateData = await User.findByIdAndUpdate(userData._id, { $set: { authSignature: newSignature }})
        let token = await jwt.sign({userId: userData._id}, newSignature, { expiresIn: '1h' });
        
        return {
            updateData: updateData,
            token: token
        };
    } catch(err) {
        console.log(err);
    }
    
}

const tokenValidityChecking = async(req, res, next)=>{
    if(typeof req.headers.token === 'undefined' || req.headers.token == ''){
        res.status(400).json('Token is required');
        return false;
    }
    try{
        let decodedData = await jwt.decode(req.headers.token);
        let userData = await User.findOne({ _id: decodedData.userId })
        jwt.verify(req.headers.token, userData.authSignature, function(err, decoded) {
            if(err){
              res.json(err)
            }else{
            //   console.log(decoded)
              req.userId = decoded.userId
              next()
            }  
        });
    } catch(err) {
        res.json(err)
    }
    
}


module.exports = {
    generateToken,
    tokenValidityChecking
  };