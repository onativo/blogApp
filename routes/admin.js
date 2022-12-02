import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('./admin/index')
})

router.get('/posts', (req, res) => {
  res.send('Post Page')
})

router.get('/cad', (req, res) => {
  res.send('Categories')
})



export default router