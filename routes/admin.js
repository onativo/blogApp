import express from 'express'
import Categoria from '../models/Categoria.js'
import mongoose from 'mongoose'
import flash from 'connect-flash'

const router = express.Router()
const Categorias = mongoose.model('categorias')

//página de categorias
  router.get('/categorias', (req, res) => {
    Categorias.find().sort({date: 'desc'}).then((categorias) => {
      res.render('./admin/categorias', {categorias: categorias})
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao listar categorias.')
      res.redirect('admin')
    })
  })

//adição de categorias
  router.get('/categoria/add', (req, res) => {
    res.render('./admin/addCategoria')
  })

//criação de categorias
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
      //Constructor do banco
      const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
      }
      new Categorias(novaCategoria)
      .save()
      .then(() => {
        req.flash('success_msg', 'Categoria adicionada.')
        res.redirect('/admin/categorias')
      })
      .catch((err) => {
        req.flash('error_msg', 'Não foi possível criar a categoria.')
        res.redirect('/admin')
      })
    }
  })

//Rota para localizar 'x' categoria
  router.get('/categorias/edit/:id', (req, res) => {
    Categorias.findOne({_id: req.params.id
      }).then((categorias) => {
        res.render('admin/editCategorias', {categoria: categorias})
      }).catch((err) => {
        req.flash('error_msg', 'Categoria inválida')
        res.redirect('/admin/categorias')
      })
  })

  //Rota para editar categoria
  router.post('/categorias/edit', (req, res) => {
    Categorias.findOne({
      _id: req.body.id
    }).then((categoria) => {
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug
      categoria.save(
      ).then(() => {
        req.flash('success_msg', 'Categoria atualizada com sucesso!!')
        res.redirect('/admin/categorias')
      }).catch((err) => {
        req.flash('error_msg', 'Erro ao salvar a edição')
        res.redirect('/admin/categorias')
      })
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao editar categoria.')
      res.redirect('/admin/categorias')
    })
  })

  //Rota para excluir categoria
  router.post('/categorias/excluir', (req, res) => {
    Categorias.deleteOne({id: req.body.id
    }).then(() => {
      req.flash('success_msg', 'Categoria excluída.')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível excluir categoria.')
      res.redirect('/admin/categorias')
    })
  })

export default router