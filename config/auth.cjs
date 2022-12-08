const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const localStrategy = require('passport-local').Strategy


require ('../models/User.js')
const User = mongoose.model('users')

modules.exports =  function(passport){
  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({email: email})
      .then((user) => {
        if(!user){
          return done(null, false, {msg: 'Esta conta não existe.'})
        }
        bcrypt.compare(password, user.password, (err, match) => {
          if(match){
            return done(null, user)
          }else{
            return done(null, false, {msg: 'Senha incorreta.'})
          }
        })
      })
    }
  ))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}