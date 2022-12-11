const express = require('express')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const router = express.Router()
const Categorias = mongoose.model('categorias')
const Post = mongoose.model('posts')
const {isAdmin} = require('../helpers/isAdmin.cjs')
const User = mongoose.model('users')

require('../models/Categoria.cjs')
require('../models/Post.cjs')

//Rota do admin
router.get('/', (req, res) => {
  res.render('admin/index')
})

    //Rota de controle de categorias
//Página de categorias cadastradas
  router.get('/categorias', (req, res) => {
    Categorias.find()
    .sort({date: -1})
    .then((categorias) => {
      res.render('./admin/categorias', {categorias: categorias})})
    .catch((err) => {
      req.flash('error_msg', 'Erro ao listar categorias.')
      res.redirect('admin')
    })
  })
//Adição de categorias
  router.get('/categoria/add', (req, res) => {
    res.render('./admin/addCategoria')
  })
//Rota de criação de categoria
  router.post('/categoria/nova', (req, res) => {
    //Form validation
    var errors = []
    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 5){
      errors.push({
        cause: 'Nome inválido. Muito curto!'
      })
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null || req.body.slug.length < 3){
      errors.push({
        cause: 'Slug inválido. Muito curto!'
      })
    }
    if(errors.length > 0){
      res.render('./admin/addCategoria',{
        errors: errors
      })
    }else{
      //Constructor
      const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
      }
      new Categorias(novaCategoria)
      .save()
      .then((categoria) => {
        let catName = categoria.nome
        req.flash('success_msg', 'Categoria ' + "'" + catName + "'" + ' adicionada.')
        res.redirect('/admin/categorias')})
      .catch((err) => {
        req.flash('error_msg', 'Não foi possível criar a categoria.')
        res.redirect('/admin')
      })
    }
  })
//Rota para editar uma categoria
  router.get('/categorias/edit/:id', (req, res) => {
    Categorias.findOne({_id: req.params.id})
    .then((categorias) => {
        res.render('admin/editCategorias', {categoria: categorias})})
    .catch((err) => {
        req.flash('error_msg', 'Categoria inválida')
        res.redirect('/admin/categorias')
      })
  })
//Rota para página de categorias cadastradas
  router.post('/categorias/edit', (req, res) => {
    Categorias.findOne({_id: req.body.id})
    .then((categoria) => {
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug
      categoria.save()
      .then(() => {
        req.flash('success_msg', 'Categoria atualizada com sucesso!!')
        res.redirect('/admin/categorias')})
      .catch((err) => {
        req.flash('error_msg', 'Erro ao salvar a edição')
        res.redirect('/admin/categorias')
      })})
    .catch((err) => {
      req.flash('error_msg', 'Erro ao editar categoria.')
      res.redirect('/admin/categorias')
    })
  })
//Rota para excluir categoria
  router.post('/categorias/excluir', (req, res) => {
    Categorias.findOne({id: req.body.id})
    .then((categoria) => {
      let cat = categoria.nome
    Categorias.deleteOne({id: req.body.id})
      .then(() => {
        req.flash('success_msg', 'Categoria ' + "'" + cat + "'" + ' excluida')
        res.redirect('/admin/categorias')})
      .catch((err) => {
        req.flash('error_msg', 'Não foi possível excluir categoria '+ "'" + slug + "'")
        res.redirect('/admin/categorias')})
    })
  })
  
    //Rota de controle de publicações  
//Rota da página de publicações enviadas
  router.get('/posts', (req, res) => {
    Post.find()
    .populate('categoria')
    .sort({data: 'desc'})
    .then((posts) => {
      res.render('admin/posts', {posts: posts})})
    .catch((err) => {
      req.flash('error_msg', 'Erro ao listar publicações!')
      res.redirect('/admin/posts')
    })
  })
//Rota que popula categorias na página de publicações
  router.get('/posts/add', (req, res) => {
    Categorias.find()
    .then((categorias) => {
      res.render('admin/addPost', {categorias: categorias})})
    .catch((err) => {
      req.flash('error_msg', 'Erro: ' + err)
      res.redirect('/admin/posts')
    })
  })
//Rota de adição de publicações
  router.post('/posts/new', (req, res) => {
    var err = []
    if(req.body.categoria == "0"){
      err.push({text: 'Categoria inválida, escolha uma categoria.'})
    }
    if(err.length > 0){
      res.render('admin/addPost', {err: err})
    }else{ 
      const newPost = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        categoria: req.body.categoria
      }
      new Post(newPost)
      .save()
      .then(() => {
          req.flash('success_msg', 'Publicação feita com sucesso!!')
          res.redirect('/admin/posts')})
      .catch((err) => {
        req.flash('error_msg', 'Falha ao salvar publicação ' + err)
        res.redirect('/admin/posts')
      })
    }
  })
//Rota para página de edução de 'x' publicação
  router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then((post) => {
      Categorias.find()
        .then((categorias) => {
          res.render('admin/editPost', {categorias: categorias, posts: post})})  
        .catch((err) => {
          req.flash('error_msg', 'Erro ao listar categorias.')
          res.redirect('/admin/posts')
      })
    })
    .catch((err) => {
      req.flash('error_msg', 'Publicação não econtrada.')
      res.redirect('/admin/posts')
    })
  })
//Rota para postar edição de publicação
  router.post('/posts/edit',  (req, res) => {
    Post.findOne({_id: req.body.id})
    .then((post) => {
      post.title = req.body.title
      post.slug = req.body.slug
      post.description = req.body.description
      post.content = req.body.content
      post.save()
      .then(() => {
        req.flash('success_msg', 'Publicação atualizada com sucesso!!')
        res.redirect('/admin/posts')})
      .catch((err) => {
        req.flash('error_msg', 'Erro ao salvar a edição. Tente novamente.')
        res.redirect('/admin/posts')
      })})
    .catch((err) => {
      req.flash('error_msg', 'Edição cancelada pelo usuário: ' + err)
      res.redirect('/admin/posts')
    })
  })
//Rota para excuir determinada publicação
  router.get('/posts/excluir/:id',  (req, res) => {
    Post.findOne({id: req.body.id})
    .then((post) => {
      let titulo = post.title
    Post.deleteOne({_id: req.params.id})
      .then(() => {
        req.flash('success_msg', 'Publicação ' + "'" + titulo + "'" + ' excluida com sucesso')
        res.redirect('admin/posts')})
      .catch((err) => {
        req.flash('error_msg', 'Impossivel excluir publicação devido a: ' + err)})
        res.redirect('/admin/posts')
    })
  })


    //Rotas de controle de usuarios cadastrados
//Rota da página de usuários cadastrados
  router.get('/users',  (req, res) => {
    User.find()
    .sort({data: -1})
    .then((users) => {
      res.render('admin/users', {users: users})})
    .catch((err) => {
      req.flash('error_msg', 'Erro ao listar usuários cadastrados!' + err)
      res.redirect('/user/cadastro')
    })
  })
//Rota para página de edição de 'x' usuário
  router.get('/users/edit/:id',  (req, res) => {
    User.findOne({_id: req.params.id})
    .then((user) => {
      res.render('admin/editUser', {user: user})
    })
    .catch((err) => {
      req.flash('error_msg', 'Usuário não econtrado.')
      res.redirect('/user/cadastro')
    })
  })
//Rota para postar edição de um usuário
  router.post('/admin/update', (req, res) => {
    User.findOne({id: req.body.id})
    .then((user) => {
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password
      user.isAdmin = req.body.isAdmin
      user.save()
      .then(() => {
        req.flash('success_msg', 'usuário atualizado')
      })
      .catch((err) => {
        req.flash('error_msg', 'erro ao atualizar: ' + err)
      })
    })
  })
//Rota para excluir um usuário
  router.get('/admin/excluir/:id',  (req, res) => {
    User.findOne({id:req.body.id})
    .then((user) => {
      let userName = user.name
      User.deleteOne({id: req.params.id})
        .then(() => {
          req.flash('success_msg', 'O usuário ' + "'" + userName + "'" + ' foi excluído com sucesso!')
          res.redirect('/admin/users')})
        .catch((err) => {
          req.flash('error_msg', 'Houve um erro na exclusão deste usuário. Contate o suporte!')
          res.redirect('/admin/users')
        })
    })
  })
//Rota de atualização de cadastro
router.get('/admin/update/:id', (req, res) => {
  User.findOne({id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'Usuário atualizado')
  })
  .catch((err) => {
    req.flash('error_msg', 'Falha ao atualizar user')
  })
})


module.exports = router