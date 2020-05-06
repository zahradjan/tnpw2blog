const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
//nastroj na mapovani http pozadavky jeste projit dokumentaci
const dompurify = createDomPurify(new JSDOM().window)
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        //default zpusobi ze kdykoliv chceme vytvorit novy article tak mu nastavi defaultni tedy aktualni cas pokud neuvedem jinak
        default: Date.now

    },

    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }

})
// tohle se zavola pred kazdym vytvorenim modelu a nelze pouzit arrow funkci protoze potrebujem k this.
articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)