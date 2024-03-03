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
                            "Personen": "",
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
            "Foto": req.body.Foto, //TODO: default fototje in public mss
            "Naam": req.body.Naam || "Naamloos recept",
            "Prijs": req.body.Prijs,
            "Personen": req.body.Personen || 1,
            "Ingredienten": req.body.Ingredienten,
            "Stappen": req.body.Stappen ? Array.isArray(req.body.Stappen) ? req.body.Stappen : [req.body.Stappen] : [], //copilot code
            "tags": req.body.CB || {} //CB is een dict die alle checkboxes bevat (zie recipeAdd.ejs)
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
router.get("/edit/:Naam", (req, res) => {
    const recipeName = req.params.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const index = recipes.indexOf(recipe);
    res.locals.recipe = recipe;
    res.locals.tags = tags;
    res.render("recipeAdd.ejs");
});
router.post("/edit", (req, res) => {
    const recipeName = req.body.Naam;
    const recipe = recipes.find(r => r.Recept.Naam === recipeName);
    const updatedRecipe = {
            "Foto": req.body.Foto, //TODO: default fototje in public mss
            "Naam": req.body.Naam || "Naamloos recept",
            "Prijs": req.body.Prijs,
            "Personen": req.body.Personen || 1,
            "Ingredienten": req.body.Ingredienten,
            "Stappen": req.body.Stappen ? Array.isArray(req.body.Stappen) ? req.body.Stappen : [req.body.Stappen] : [], //copilot code
            "tags": req.body.CB || {} //CB is een dict die alle checkboxes bevat (zie recipeAdd.ejs)
        };
    
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
