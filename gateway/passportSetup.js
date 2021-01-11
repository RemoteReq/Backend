const path = require('path');
const express = require('express');
const passport = require('passport');
// const { Strategy } = require('passport-google-oauth20');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: '1080196925218-eijmcgfi1f2r38q3v0m3posr21s08cv6.apps.googleusercontent.com',
    clientSecret: 'vKqHOsTQe71uHZFaMuErNKDs',
    callbackURL: "http://localhost:3030/google/callback"
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
