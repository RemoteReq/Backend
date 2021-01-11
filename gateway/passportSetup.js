const path = require('path');
const express = require('express');
const passport = require('passport');
// const { Strategy } = require('passport-google-oauth20');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log('accessToken',accessToken)
    // console.log('refreshToken',refreshToken)
    // console.log('profile',profile)
    return cb(null, profile);
  }
));

passport.serializeUser((user, cb) => {
  // console.log('user', user)
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  // console.log('obj', obj)
  cb(null, obj);
});
