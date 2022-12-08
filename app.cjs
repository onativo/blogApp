const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('./models/Post.cjs')
const Posts = mongoose.model('posts')
require('./models/Categoria.cjs')
const Categoria = mongoose.model('categorias')
require('./models/User.js')
const User = mongoose.model('users')
const user = require('./routes/user.cjs')
const admin = require('./routes/admin.cjs')


//Config
  //Session
    app.use(session({
      secret: 'this.is.a.secret',
      resave: true,
      saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
  //Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      res.locals.error = req.flash('error')
      next()
    })
  
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
    // app.use(express.static('/public'))
    // app.use(express.static(path.join(__dirname, '/public')))
    app.use(express.static(path.join(__dirname, "public")))
    app.use((req, res, next) => {
      console.log('kambum!')
      next()
    })

//Routes
  //Rota do admin
    app.use('/admin', admin)
    
    //Rota de usuários
    app.use('/user', user)

  //Rota da main page
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

  //Rota da página inicial que leva a 'x' publicação
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
    
  //Rota de página não encontrada
  app.get('/404', (req, res) => {
    res.send('Erro 404!')
  })

  //Rota da página de categorias
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

  //Rota que lista todas publicações de 'x' categoria
  app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug})
    .then((categoria) => {
      if(categoria){
        Posts.find({categoria: categoria._id})
        .then((posts) => {
          res.render('categorias/posts', {posts: posts, categoria: categoria})
        })
        .catch((err) => {
          req.flash('error_msg', 'Erro ao listar publicações')
          res.redirect('/')
        })
      }else{
        req.flash('error_msg', 'Esta categoria não tem publicações')
        res.redirect('/')
      }
    })
    .catch((err) => {
      req.flash('error_msg', 'Erro ao listar publicações desta categoria')
      res.redirect('/')
    })
  })

  //Rota de cadastro de usuario
  // app.get('/users', (req, res) => {
  //   res.render('users/cadastro')
  // })

//Otehrs
  const PORT = 8082
  app.listen(PORT, () => {
    console.log('...connected.')})