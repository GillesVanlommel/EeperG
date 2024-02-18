const express = require('express');
const router = express.Router();
const utils = require("../data/utils.js");
const bodyParser = require("body-parser");
const fs = require('fs');


// Parse application of wa da ook mag betekenen
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Read in the JSON file
let recipes = null;
utils.readJson("./data/recipes.json")
    .then(data => {
        recipes = data;
    })
    .catch(error => console.error(error));

// Base route for /recipe/
router.get('/', (req, res) => {
    res.render('recipeList.ejs', { recipes });
});

// route for when we want to add a recipe
router.get("/add", (req, res) => {
    res.sendFile("recipeAdd.html");
});
router.post("/add", (req, res) => {
    const newRecipe = req.body;
    // TODO: De stappen input heeft nog werk nodig.
    recipes.push(
        {
            "Recept": newRecipe
        }
    );
    fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
    console.log("data has been updated");
    
    res.redirect("/recipes")
});

// TODO: Dees is een tijdelijke route zodat ik eventjes de searchbar kan testen
router.get("/tijdelijk", (req, res) => {
    res.render("mama.ejs", {recipes});
});

// the moment a recipe is clicked and we to /recipe/name go
router.get('/:Naam', (req, res) => {
    const recipeName = req.params.Naam;
    console.log(recipeName)
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const recept = recipe.Recept;

    if (!recipe) {
        return res.status(404).send('Recipe not found');
    }

    res.render('recipeDetails.ejs', { recept });
});



module.exports = router;
