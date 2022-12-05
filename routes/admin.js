import express from 'express'
import Categoria from '../models/Categoria.js'
import Posts from '../models/Post.js'
import mongoose from 'mongoose'
import flash from 'connect-flash'

const router = express.Router()
const Categorias = mongoose.model('categorias')
const Post = mongoose.model('posts')

//Página de categorias
  router.get('/categorias', (req, res) => {
    Categorias.find().sort({date: -1})
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
//Criação de categorias
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
  
//Rota para localizar 'x' categoria
  router.get('/categorias/edit/:id', (req, res) => {
    Categorias.findOne({_id: req.params.id})
    .then((categorias) => {
        res.render('admin/editCategorias', {categoria: categorias})})
    .catch((err) => {
        req.flash('error_msg', 'Categoria inválida')
        res.redirect('/admin/categorias')
      })
  })
  //Rota para editar categoria
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
  //Rota da página de publicações
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
  //Rota de criação de publicação
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

  //Rota para localizar 'x' publicação
  router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then((post) => {
      Categorias.find()
        .then((categorias) => {
          res.render('admin/editPost', {categorias: categorias, posts: post})})  
        .catch((err) => {
          req.flash('error_msg', 'Erro ao listar categorias.')
          res.redirect('/admin/posts')})
    })
    .catch((err) => {
      req.flash('error_msg', 'Publicação não econtrada.')
      res.redirect('/admin/posts')
    })
  })
  //Rota para editar publicação
    router.post('/posts/edit', (req, res) => {
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
        console.log(err)
      })
    })
    // //Rota para excuir publicações
    router.get('/posts/excluir/:id', (req, res) => {
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

    //2ª Rota para excluir publicações
    // router.get('/posts/excluir/:id', (req, res) => {
    //   Post.remove({_id: req.params.id})
    //   .then(() => {
    //     res.redirect('/admin/posts')
    //   })
    //   .catch((err) => {
    //   })
    // })



export default router