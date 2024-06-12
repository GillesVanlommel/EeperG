const express = require('express');
const serverless = require('serverless-http')
const app = express();
const port = 3000;

// Set the views folder
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set the static
app.use(express.static('public'));

// Middleware voor wnr er een path komt da begint met "/recipes" in dat geval wordt deze js gebruikt. 
const recipesRoute = require('./routes/routes.js');
app.use('/recipes', recipesRoute);

// Start op deze route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.export.handler = serverless('app')
