import mongoose from "mongoose"
const Schema = mongoose.Schema

//Constructor
  const Post = new Schema({
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    categoria: {
      type: Schema.Types.ObjectID,
      ref: "categorias",
      required: true
    },
    data: {
      type: Date,
      default: Date.now()
    }
  })

  mongoose.model('posts', Post)

  export default Post