import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('./admin/index')
})

router.get('/posts', (req, res) => {
  res.send('Post Page')
})

router.get('/categorias', (req, res) => {
  res.render('./admin/categorias')
})
router.get('/categoria/add', (req, res) => {
  res.render('./admin/addCategoria')
})

export default router