const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../../database/models/User');
const authorisation = require('../../authentication')
// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/', (req, res)=>{
    res.status(200).json('Logged out...')
})

router.get('/google/failure', (req, res)=>{
    res.status(200).json('Sorry! google login failed')
})

router.get('/google/success', isLoggedIn, async(req, res)=>{
    let checkUserData = await User.findOne({"email" : req.user._json.email, isDeleteAccount: false});
    if(checkUserData == null){
        const user = new User({
            username: '',
            password: '',
            fullName: req.user._json.name,
            email: req.user._json.email,
            authSignature: '',

            eligibleToWorkInUS: null,
            causes: [],
            jobType: '',
            soonestJoinDate: null,
            fluentInEnglish: null,

            highestEducationLevel: '',
            reasonForCause: '',
            availableWorkHours: '',
            timeZone: '',
            hourlyWage: null,
            salary: null,
            projectDescription: '',
            sampleProjectLink: '',
            relavantCertificates: '',
            isWorkRemotely: null,
            aboutMe: '',
            projectDescription: '',
            totalExperience: null,
            desireKeySkills: [],
            location: '',

            linkedInURL: '',
            personalURL: '',
            mobileNum: '',
            howLongWorkingRemotely: null, 
            otherLanguages: [],
            refferedBy: '',
            profilePicUrl: req.user._json.picture,
            resumePath: '',
            
            // address: '',
        });

        //save user's details
        user.save()
        .then(async(doc) => {
            console.log('Register with google')
            let userDataWithToken = await authorisation.generateToken(doc);
            res.status(200).json({
                token: userDataWithToken.token,
                username: userDataWithToken.updateData.username,
                fullName: userDataWithToken.updateData.fullName,
                email: userDataWithToken.updateData.email
            });
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }else{
        console.log('Login with google')
        let userDataWithToken = await authorisation.generateToken(checkUserData);
        res.status(200).json({
            token: userDataWithToken.token,
            username: userDataWithToken.updateData.username,
            fullName: userDataWithToken.updateData.fullName,
            email: userDataWithToken.updateData.email
        });
    }
})

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/google/failure' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/google/success');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;