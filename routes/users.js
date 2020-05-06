const User = require('../models/user');
const express = require('express')
const bcrypt = require('bcrypt');

const passport = require('passport');
const router = express.Router()


router.get('/register', (req, res) => {
    res.render('./users/register')
})
router.get('/login', (req, res) => {
    res.render('./users/login')
})


router.post('/register', (req, res) => {
    const { name, email, password} = req.body;

    let errors = [];
    console.log("email:" + email)
    console.log("heslo:" + password)

    if (!name || !email || !password) {
        errors.push({ msg: 'Prosím vyplňte všechny údaje!' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'Příliš krátké heslo! Heslo musí mít alespoň 6 znaků!' })
    }
    errors.forEach((error) => { console.log(error.msg) })

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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Byli jste odhlášeni');
    res.redirect('/users/login');
});







































/* 
signup  = async (req, res) => {
    try {
        const { email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role || "basic" });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            accessToken
        })
    } catch (error) {
        throw error
    }
}
login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            data: { email: user.email, role: user.role },
            accessToken
        })
    } catch (error) {
        throw error;
        //next(error);
    }
}
getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        data: users
    });
}

getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return next(new Error('User does not exist'));
        res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error)
    }
}

updateUser = async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });
    } catch (error) {
        next(error)
    }
}

deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}
 */
module.exports = router