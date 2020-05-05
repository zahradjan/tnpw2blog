const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const Article = require('./models/article')
const User = require('./models/user')
const passport = require('passport');
const app = express()
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');

const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

// Passport Config
require('./config/passport')(passport);

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }))



// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Connect flash
app.use(flash());



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



//pro prepisovani jednotlivych Http pozadavku
app.use(methodOverride('_method'))
app.use(express.json())
app.use('/users',userRouter);
app.use('/articles',articleRouter);



app.get('/', ensureAuthenticated, async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles, name:req.user.name })
})








app.listen(5000, () => { console.log('Server běží na portu 5000!') })

