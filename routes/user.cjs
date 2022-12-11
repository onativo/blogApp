const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { default: isAdmin } = require('../helpers/isAdmin.cjs')

require('../models/User')
const User = mongoose.model('users')

//Rota de cadastro
  router.get('/cadastro', (req, res) => {
    res.render('users/cadastro')
  })

//Rota de envio de cadastro + validação
  router.post('/cadastro', (req, res) => {

    var err = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
      err.push({cause: 'Atenção! Nome inválido.'})
    }
    if(!req.body.email || req.body.email == undefined || req.body.email == null){
      err.push({cause: 'Atenção! E-mail inválido.'})
    }
    if(!req.body.password || req.body.password == undefined || req.body.password == null){
      err.push({cause: 'Atenção! Senha inválida.'})
    }
    if(!req.body.password2 || req.body.password2 == undefined || req.body.password2 == null){
      err.push({cause: 'Atenção! Confirme sua senha.'})
    }
    if(req.body.password.length < 4){
      err.push({cause: 'Senha muito curta.'})
    }
    if(req.body.password != req.body.password2){
      err.push({cause: 'As senhas não combinam.'})
    }
    if(err.length > 0){
      res.render('users/cadastro', {err: err})
    }
    else{
      User.findOne({email: req.body.email})
      .then((user) => {
        if(user){
          const userEmail = user.email
          req.flash('error_msg', 'Já existe uma conta com o email: ' + "'" + userEmail + "'.")
          res.redirect('/user/cadastro')
        }else{
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
          })
          console.log(newUser.isAdmin)
          // console.log(newUser.isAdmin)
            //Hasheando a senha
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              const userName = newUser.name
              if(err){
                req.flash('error_msg', 'Erro ao criar novo usuário. Tente novamente.')
                res.redirect('/user/cadastro')
              }else{
                newUser.password = hash
                newUser.save()
                .then(() => {
                  req.flash('success_msg', 'O usuário ' + "'" + userName + "'" + ' foi cadastrado.')
                  res.redirect('/user/cadastro')
                })
                .catch((err) => {
                  req.flash('error_msg', 'Ocoreu o seguinte erro: ' + err)
                  res.redirect('user/cadastro')
                })
              }
            })
          })
        }
      })
      .catch((err) => {
        req.flash('error_msg', 'Houve um erro. Contate o suporte. ' + err)
        res.redirect('/user/cadastro')
      })
    }
  })

//Rota de login
  router.get('/login', (req, res) => {
    res.render('users/login')
  })
//Rota de autenticação de login
  router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: '/',
      failureRedirect: '/user/cadastro',
      failureFlash: true
    })(req, res, next)
  })
//Rota de logout
  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if(err){
        return(next(err))
      }
      res.redirect('/')
    })
    req.flash('success_msg', 'Sucesso! Entre na sua conta para ter acesso de administrador.')
  })

  module.exports = router