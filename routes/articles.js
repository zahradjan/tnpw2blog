const express = require('express')
const router = express.Router()
const Article = require('./../models/article')



const { ensureAuthenticated } = require('../config/auth');


//Zobrazení stránky pro vytvoření nového článku
router.get('/new', ensureAuthenticated,(req,res) =>{
   
    res.render('articles/new', {article: new Article(), name:req.user.name})
})

//Zobrazení stránky pro editaci stávajícího článku
router.get('/edit/:id', ensureAuthenticated, async (req,res) =>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article,name:req.user.name})
})

//Zobrazení stránky pro samostatné zobrazení vybraného článku
router.get('/:slug', ensureAuthenticated, async(req,res) => {
  const article =  await Article.findOne({slug:req.params.slug})
  if(article==null) res.redirect('/')
  res.render('articles/show', {article:article, name:req.user.name})  
})

//Vytvoření POST požadavku na vytvoření nového článku
router.post('/', ensureAuthenticated,async(req,res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

//PUT požadavek pro úpravu stávajícího článku
router.put('/:id',ensureAuthenticated,  async(req,res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//DELETE požadavek pro smazání článku
router.delete('/:id',ensureAuthenticated,async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

// funkce pro uložení článku a přesměrovaní na zobrazení článku
function saveArticleAndRedirect(path){
    return async(req,res) =>{
        let article =  req.article
            article.title = req.body.title
            article.author = req.user.name
            article.description =  req.body.description
            article.markdown = req.body.markdown
        
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            res.render(`articles/${path}`, {article:article})
        }
    }
}


module.exports = router