const express = require('express');
const router = express.Router();
const utils = require("../data/utils.js");
const bodyParser = require("body-parser");
const fs = require('fs');

// Parse application of wa da ook mag betekenen
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Read in the JSON file
let recipes = null;
utils.readJson("./data/recipes.json")
    .then(data => {
        recipes = data;
    })
    .catch(error => console.error(error));

const tags = [
    "vegan",
    "ei",
    "gluten",
    "lupine",
    "melk",
    "sesamzaad",
    "noten",
    "zwaveldioxide",
    "selderij",
    "pinda",
    "mosterd",
    "vis",
    "weekdieren",
    "soja",
    "schaaldieren"
    ]

// Base route for /recipe/
router.get('/', (req, res) => {
    res.locals.recipes = recipes;
    res.render('recipeList.ejs');
});

// route for when we want to add a recipe
router.get("/add", (req, res) => {
    res.locals.recipe = {"Recept": {
                            "Foto": "",
                            "Naam": "",
                            "Prijs": "",
                            "personen": "",
                            "Ingredienten": "",
                            "Stappen": [],
                            "tags": []
                            }
                        }
    res.locals.tags = tags;
    res.render("recipeAdd.ejs");
});

router.post("/add", (req, res) => {
    const newRecipe = {
        "Recept": {
            "Foto": req.body.Foto,
            "Naam": req.body.Naam,
            "Prijs": req.body.Prijs,
            "personen": req.body.personen,
            "Ingredienten": req.body.Ingredienten,
            "Stappen": req.body.Stappen ? Array.isArray(req.body.Stappen) ? req.body.Stappen : [req.body.Stappen] : [],
            "tags": req.body.CB || {}
        }
    }
        
    recipes.push(newRecipe);
    
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
//TODO: zorgen dat de edit pagina alvast de huidige waardes van het recept laat zien
router.get("/edit/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    res.render("recipeAdd.ejs", {recipe});
});
router.post("/edit", (req, res) => {
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
//TODO: zorgen dat de edit pagina alvast de huidige waardes van het recept laat zien
router.get("/edit/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    res.render("recipeAdd.ejs", {recipe});
});
router.post("/edit", (req, res) => {
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
//TODO: zorgen dat de edit pagina alvast de huidige waardes van het recept laat zien
router.get("/edit/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    res.render("recipeAdd.ejs", {recipe});
});
router.post("/edit", (req, res) => {
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
    res.locals.recept = recept;
    res.locals.tags = tags;
    res.render('recipeDetails.ejs');
});



module.exports = router;
