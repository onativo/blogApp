//import modules
  import express from 'express'
  import handlebars from 'express-handlebars'
  const app = express()
  import path from 'path'
  import admin from './routes/admin.js'
  import {fileURLToPath} from 'url';
  const __dirname = fileURLToPath(import.meta.url)
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
  
  //Public
    app.use(express.static('/public'))



//Routes
  app.use('/admin', admin)
//Otehrs
  const PORT = 8082
  app.listen(PORT, () => {
    console.log('Success!!')
  })