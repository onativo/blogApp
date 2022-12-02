import mongoose from "mongoose"

const Schema = mongoose.Schema
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

export default Categoria