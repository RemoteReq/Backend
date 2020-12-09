const express = require('express');
const router = express.Router();
const User = require('../database/models/User')
const Employer = require('../database/models/Employer')
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');
const secretKeyForResetToken = 'remoteReq reset key for users'
const secretKeyForResetTokenForEmp = 'remoteReq reset key for employers'

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

//token generate for reset password (job seeker end)
const resetTokenGenerate = async(userData)=> {
    try{
        let token = await jwt.sign({userId: userData._id}, secretKeyForResetToken, { expiresIn: '15m' });
        return token;

    } catch(err) {
        console.log(err);
    }
}
//token generate for reset password (employer end)
const resetTokenGenerateForEmp = async(empData)=> {
    try{
        let token = await jwt.sign({employerId: empData._id}, secretKeyForResetTokenForEmp, { expiresIn: '15m' });
        return token;

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
        jwt.verify(req.headers.token, userData.authSignature, async function(err, decoded) {
            if(err){
                if(err.name == 'JsonWebTokenError'){
                    res.status(400).json(err)
                }else if(err.name == 'TokenExpiredError'){
                    // res.status(401).json(err)
                    let newToken = await refreshToken(decodedData.userId, 'user');
                    // console.log(newToken)
                    res.status(401).json({
                        message: 'Token is expired. Please use new token.',
                        newToken: newToken
                    })
                }else{
                    res.status(400).json(err)
                }
            }else{
            //   console.log("decoded",decoded)
              req.userId = decoded.userId
              next()
            }  
        });
    } catch(err) {
        console.log("err1",err)
        res.status(400).json(err)
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
        // console.log('decodedData',decodedData)
        let getData = await Employer.findOne({ _id: decodedData.employerId })
        jwt.verify(req.headers.token, getData.authSignature, async function(err, decoded) {
            if(err){
            //   res.json(err)
                if(err.name == 'JsonWebTokenError'){
                    res.status(400).json(err)
                }else if(err.name == 'TokenExpiredError'){
                    // res.status(401).json(err)
                    let newToken = await refreshToken(decodedData.employerId, 'employer');
                    // console.log(newToken)
                    res.status(401).json({
                        message: 'Token is expired. Please use new token.',
                        newToken: newToken
                    })
                }else{
                    res.status(400).json(err)
                }
            }else{
            //   console.log(decoded)
              req.employerId = decoded.employerId
              next()
            }  
        });
    } catch(err) {
        res.status(400).json(err)
    }
    
}

const refreshToken = async(id, roleType)=> {
    // console.log(id)
    const newSignature = randtoken.uid(256);
    try{
        let generateNewToken = '';
        if(roleType == 'user'){
            await User.findByIdAndUpdate(id, { $set: { authSignature: newSignature }})
            generateNewToken = await jwt.sign({userId: id}, newSignature, { expiresIn: '1d' });
        }else{
            await Employer.findByIdAndUpdate(id, { $set: { authSignature: newSignature }})
            generateNewToken = await jwt.sign({employerId: id}, newSignature, { expiresIn: '1d' });
        }
        
        // return {
        //     updateData: updateData,
        //     token: token
        // };
        return generateNewToken;
    } catch(err) {
        console.log(err);
    }
}



module.exports = {
    generateToken,
    tokenValidityChecking,
    generateTokenForEmp,
    tokenValidityCheckingForEmp,
    resetTokenGenerate,
    resetTokenGenerateForEmp
  };