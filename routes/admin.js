import express from 'express'
import Categoria from '../models/Categoria.js'
import mongoose from 'mongoose'
import flash from 'connect-flash'

const router = express.Router()
const Categorias = mongoose.model('categorias')

router.get('/', (req, res) => {
  res.render('./admin/index')
})
router.get('/categorias', (req, res) => {
  Categorias.find().sort({date: 'desc'}).then((categorias) => {
    res.render('./admin/categorias', {categorias: categorias})
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao listar categorias.')
    res.redirect('admin')
  })
})

router.get('./posts', (req, res) => {
  res.send('Post Page')
})


router.get('/categoria/add', (req, res) => {
  res.render('./admin/addCategoria')
})

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

export default router