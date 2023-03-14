const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if (err) return next(err);
            // console.log(registerUser);
            req.flash('success', 'Welcome to Family Fun Finder!');
            res.redirect('/kidgrounds');
        })
    } catch (e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/kidgrounds';
    console.log(redirectUrl);
    delete req.session.returnTo;
    return res.redirect(redirectUrl); 
}

module.exports.logout = (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('success', "Goodbye!");
      res.redirect("/kidgrounds");
    });
  }