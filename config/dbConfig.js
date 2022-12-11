if(process.env.NODE_ENV = 'blogApp-prod'){
  module.exports = {
    mongoURI: "mongodb+srv://vini:<password>@blogapp-prod.opnieg2.mongodb.net/test"
  }
}else{
  module.exports = {
    mongoURI: 'mongodb://127.0.0.1:27017/blogApp'
  }
}