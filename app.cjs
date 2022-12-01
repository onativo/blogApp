//import modules
  const express = require('express')
  const handlebars = require('express-handlebars')
  const app = express()
  const admin = require('./routes/admin.cjs')
  //import mongoose from "mongoose";

//Config
  //Body Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
  //Handlebars
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main',
      runtimeOptions:{
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true}}))
    app.set('view engine', 'handlebars')

  //Mongoose config
  ///
//Routes
  app.use('/admin', admin)
//Otehrs
  const PORT = 8082
  app.listen(PORT, () => {
    console.log('Success!!')
  })