import express from "express";
import mongoose from "mongoose";
import Users from '../models/User.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

const User = mongoose.model('users')

router.get('/cadastro', (req, res) => {
  res.render('users/cadastro')
})

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
      const userEmail = user.email
      if(user){
        req.flash('error_msg', 'Já existe uma conta com o email: ' + "'" + userEmail + "' .")
        res.redirect('/user/cadastro')
      }else{
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })

        //Hasheando a senha
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            const userName = newUser.name
            if(err){
              req.flash('error_msg', 'Erro ao criar novo usuário. Tente novamente.')
              res.redirect('/user/cadastro')
            }else{
              newUser.password = hash
              newUser.save().then(() => {
                req.flash('success_msg', 'O usuário ' + "'" + userName + "'" + ' foi cadastrado.')
                res.redirect('/user/cadastro')
              })
              .catch((err) => {
                req.flash('error_msg', 'Ocoreu o seguinte erro: ' + err)
                res.redirect('/user/cadastro')
              })
            }
          })
        })
      }
    })
    .catch((err) => {
      req.flash('error_msg', 'Houve um erro, tente novamente. ' + err)
      res.redirect('/user/cadastro')
    })
  }
})


export default router