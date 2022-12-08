const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Constructor
  const Categoria = new Schema({
    nome: {
      type: String,
      required: true,
      default: 'Não inseriu nome'
    },
    slug: {
      type: String,
      default: 'main',
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    }
  })

mongoose.model('categorias', Categoria)

module.exports = Categoria