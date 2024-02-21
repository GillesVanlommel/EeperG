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
    res.render("recipeAdd.ejs", {});
});
router.post("/add", (req, res) => {
    const newRecipe = req.body;
    recipes.push(
        {
            "Recept": newRecipe
        }
    );
    fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
    console.log("data has been updated");
    
    res.redirect("/recipes")
});

// route for when we want to delete a recipe
router.post("/delete/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    recipes.splice(index, 1);
    fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
    res.redirect("/recipes");
});

// route for when we want to edit a recipe
router.post("/edit/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    res.render("recipeAdd.ejs", {recipe});
});
router.get("/edit", (req, res) => {
    const recipeName = req.body.Naam;
    const updatedRecipe = req.body;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    
    if (!recipe) {
        return res.status(404).send('Recipe not found');
    }
    
    recipe.Recept = updatedRecipe;
    fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
    console.log("Recipe has been updated");
    
    res.redirect("/recipes");
});

// the moment a recipe is clicked and we to /recipe/name do
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
