const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const Article = require('./models/article')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }))
//pro prepisovani jednotlivych Http pozadavku
app.use(methodOverride('_method'))
app.use(express.json())
app.use('/users',userRouter);



app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})








app.listen(5000, () => { console.log('Server běží na portu 5000!') })

