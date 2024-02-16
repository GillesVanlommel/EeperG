const express = require('express')
const app = express()
const port = 3000

/* Express zoekt by default een 'views' folder, dus moete geen pad geven ergens*/
app.set('view engine', 'ejs') /* Zet onze app (instance van express()) als engine*/

const posts = [
    {title: 'a', body: 'z'},
    {title: 'b', body: 'y'},
    {title: 'the', body: 'x'},
]

app.listen(port, () => {
    console.log('listening to ${port}')
})

/* Alle sites */

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/important', (req, res) => {
    res.render('pages/important')
})

app.get('/articles', (req, res) => {
    res.render('pages/articles', {
        articles: posts
    })
})