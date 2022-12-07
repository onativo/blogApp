//import modules
  import express from 'express'
  import handlebars from 'express-handlebars'
  import Handlebars from 'handlebars/runtime.js'
  import path from 'path'
  import admin from './routes/admin.js'
  import {fileURLToPath} from 'url';
  import mongoose from 'mongoose'
  import flash from 'connect-flash'
  import session from 'express-session'
  import Post from './models/Post.js';
  import Categorias from './models/Categoria.js'
  
  const Categoria = mongoose.model('categorias')
  const Posts = mongoose.model('posts')
  const app = express()
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

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
    app.use(express.static(path.join(__dirname, '/public')))
  
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
    mongoose.connect('mongodb://127.0.0.1:27017/blogApp',{
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
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

  app.get('/', (req, res) => {
    Posts.find()
    .lean()
    .populate('categoria')
    .sort({data: 'desc'})
    .then((posts) => {
      res.render('index', {posts: posts})})
    .catch((err) => {
      req.flash('error_msg', 'Erro ao carregar as publicações' + err)
      res.redirect('/404')
    })
  })
    app.get('/post/:slug', (req, res) => {
      Posts.findOne({slug: req.params.slug})
      .then((post) => {
        if(post){
          res.render('post/index', {post: post})
        }else{
          req.flash('error_msg', 'Desculpe! Publicação não encontrada')
          res.redirect('/cartegorias')}
        })
      .catch((err) => {
          req.flash('error_msg', 'Publicação inexistente' + err)
          res.redirect('/posts')
      })
    })
    
    app.get('/404', (req, res) => {
      res.send('Erro 404!')
    })

    app.get('/categorias', (req, res) => {
      Categoria.find()
      .then((categorias ) => {
        res.render('categorias/index', {categorias : categorias})
      })
      .catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias' + err)
        res.redirect('/')
      })
    })

//Otehrs
  const PORT = 8082
  app.listen(PORT, () => {
    console.log('Connected.')})