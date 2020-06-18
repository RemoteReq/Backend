const express = require('express');
const router = express.Router();
const User = require('../database/models/User')
const Employer = require('../database/models/Employer')
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');

//token generate for user
const generateToken = async(userData)=> {
    const newSignature = randtoken.uid(256);
    // userData.authSignature = newSignature;
    try{
        let updateData = await User.findByIdAndUpdate(userData._id, { $set: { authSignature: newSignature }})
        let token = await jwt.sign({userId: userData._id}, newSignature, { expiresIn: '1d' });
        
        return {
            updateData: updateData,
            token: token
        };
    } catch(err) {
        console.log(err);
    }
    
}
//token generate for employer
const generateTokenForEmp = async(empData)=> {
    const newSignature = randtoken.uid(256);
    // userData.authSignature = newSignature;
    try{
        let updateData = await Employer.findByIdAndUpdate(empData._id, { $set: { authSignature: newSignature }})
        let token = await jwt.sign({employerId: empData._id}, newSignature, { expiresIn: '1d' });
        
        return {
            updateData: updateData,
            token: token
        };
    } catch(err) {
        console.log(err);
    }
    
}
//check validate token for user's API
const tokenValidityChecking = async(req, res, next)=>{
    if(typeof req.headers.token === 'undefined' || req.headers.token == ''){
        res.status(400).json('Token is required');
        return false;
    }
    try{
        let decodedData = await jwt.decode(req.headers.token);
        // console.log('decodedData', decodedData)
        let userData = await User.findOne({ _id: decodedData.userId })
        jwt.verify(req.headers.token, userData.authSignature, function(err, decoded) {
            if(err){
              res.json(err)
            }else{
            //   console.log("decoded",decoded)
              req.userId = decoded.userId
              next()
            }  
        });
    } catch(err) {
        console.log("err1",err)
        res.json(err)
    }
    
}

//check validate token for employer's API
const tokenValidityCheckingForEmp = async(req, res, next)=>{
    if(typeof req.headers.token === 'undefined' || req.headers.token == ''){
        res.status(400).json('Token is required');
        return false;
    }
    try{
        let decodedData = await jwt.decode(req.headers.token);
        // console.log(decodedData)
        let getData = await Employer.findOne({ _id: decodedData.employerId })
        jwt.verify(req.headers.token, getData.authSignature, function(err, decoded) {
            if(err){
              res.json(err)
            }else{
            //   console.log(decoded)
              req.employerId = decoded.employerId
              next()
            }  
        });
    } catch(err) {
        res.json(err)
    }
    
}


module.exports = {
    generateToken,
    tokenValidityChecking,
    generateTokenForEmp,
    tokenValidityCheckingForEmp
  };