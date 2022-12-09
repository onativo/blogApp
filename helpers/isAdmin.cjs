module.exports = {
  isAdmin: function(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin == 1){
      return next()
    }else{
      req.flash('error_msg', 'Usuário não tem permissão para acessar esta página.')
      res.redirect('/')
    }
  }
}