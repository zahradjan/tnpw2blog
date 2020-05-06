const User = require('../models/user');
const express = require('express')
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router()

//GET požadavek pro zobrazení stránky regisrace nového uživatele
router.get('/register', (req, res) => {
    res.render('./users/register')
})
//GET požadavek pro zobrazení stránky přihlášená uživatele
router.get('/login', (req, res) => {
    res.render('./users/login')
})

//POST požadavek pro registraci nového uživatele
router.post('/register', (req, res) => {
    const { name, email, password} = req.body;

    let errors = [];
    console.log("name:" + name)
    console.log("email:" + email)
    console.log("heslo:" + password)

    if (!name || !email || !password) {
        errors.push({ msg: 'Prosím vyplňte všechny údaje!' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'Příliš krátké heslo! Heslo musí mít alespoň 6 znaků!' })
     }
  

    if (errors.length > 0) {

        res.render('./users/register', {
            errors, email, password
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email již existuje' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password
                   
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                    
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'Nyní jste registrovaní a můžete se přihlásit'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

//POST požadavek pro přihlášení uživatele
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

///POST požadavek pro odhlášení uživatele
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Byli jste odhlášeni');
    res.redirect('/users/login');
});

module.exports = router