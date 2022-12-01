//import modules
  import express from 'express'
  import handlebars from 'express-handlebars'
  const app = express()
  import admin from './routes/admin.js'
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