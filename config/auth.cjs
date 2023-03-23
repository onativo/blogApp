const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const localStrategy = require('passport-local').Strategy


require ('../models/User.js')
const User = mongoose.model('users')

module.exports =  function(passport){
  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({email: email})
      .then((user) => {
        if(!user){
          return done(null, false, {message: 'Esta conta não existe. Cadastre-se primeiro :)'})
        }
        bcrypt.compare(password, user.password, (err, match) => {
          if(match){
            return done(null, user)
          }else{
            return done(null, false, {message: 'Senha incorreta. Tente recuperá-la.'})
          }
        })
      })
    }
  ))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try{
      const user = await User.findById(id)
        done(null, user)
      }
    catch(err){
      done(err)
    }
  })
}