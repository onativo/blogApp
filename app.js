//import modules
  import express from 'express'
  import handlebars from 'express-handlebars'
  import path from 'path'
  import admin from './routes/admin.js'
  import {fileURLToPath} from 'url';
  import mongoose from 'mongoose'
  import flash from 'connect-flash'
  import session from 'express-session'

  const app = express()
  const __dirname = fileURLToPath(import.meta.url)

//Config
  //Session
    app.use(session({
      secret: 'this.is.a.secret',
      resave: true,
      saveUninitialized: true
    }))
    app.use(flash())
  //Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash(("success_msg"))
      res.locals.error_msg = req.flash(("error_msg"))
      next()
    })
    app.use(express.static('public'))
  
  //Body Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
  //Handlebars
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main',
      runtimeOptions:{
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true}}))
    app.set('view engine', 'handlebars')
  
  //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://127.0.0.1:27017/blogApp'
    ).then(() => {
      console.log('Successful connection with MongoDB.')
    }).catch((err) => {
      console.log('Failed due to: ' + err)
    })

  //Public
    app.use(express.static('/public'))

    app.use((req, res, next) => {
      console.log('kambum!')
      next()
    })


//Routes
  app.use('/admin', admin)
//Otehrs
  const PORT = 8082
  app.listen(PORT, () => {
    console.log('Connected.')
  })