const express = require('express');
const router = express.Router();
const User = require('../database/models/User')
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');


const generateToken = async(userData)=> {
    const newSignature = randtoken.uid(256);
    userData.credentials.authSignature = newSignature;
    try{
        let updateData = await User.findByIdAndUpdate(userData._id, { $set: userData})
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
    try{
        let decodedData = await jwt.decode(req.headers.token);
        let userData = await User.findOne({ _id: decodedData.userId })
        jwt.verify(req.headers.token, userData.credentials.authSignature, function(err, decoded) {
            if(err){
              res.json(err)
            }else{
            //   console.log(decoded)
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