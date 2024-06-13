const express = require('express');
const router = express.Router();
const utils = require("../data/utils.js");
const bodyParser = require("body-parser");
const fs = require('fs');
const { type } = require('os');

// Parse application of wa da ook mag betekenen
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Read in the ID file
let ids = null;
utils.readJson("./data/ids.json")
    .then(data => {
        ids = data;
    })
    .catch(error => console.error(error));

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
router.get("/", (req, res) => {
    res.locals.recipes = recipes;
    res.render("recipeList.ejs");
})
router.post('/verifyPassword', (req, res) => {
    console.log(req.body);
    const submittedPassword = req.body.password;
    const correctPassword = "bigbootybitches";
    if (submittedPassword === correctPassword) {
        res.locals.recipes = recipes;
        res.render('recipeList.ejs');
    } else {
        res.status(401).send("Unauthorized");
    }
});

// route for when we want to add a recipe
router.get("/add", (req, res) => {
    res.locals.recipe = {"Recept": {
                            "Foto": "",
                            'Id': 0,
                            "Naam": "",
                            "Prijs": "",
                            "Personen": 1,
                            "Ingredienten": {},
                            "Stappen": [],
                            "tags": {}
                            }
                        }
    res.locals.tags = tags;
    res.render("recipeAdd.ejs");
});

router.post("/add", (req, res) => {
    utils.generateId(req.body.Naam, ids)
        .then(generatedId => {
            const newRecipe = {
                "Recept": {
                    "Foto": req.body.Foto, //TODO: default fototje in public mss
                    "Id": generatedId || 0, //TODO: da besta nog ni LMAOOOOOOOOOO
                    "Naam": req.body.Naam || "Naamloos recept",
                    "Prijs": req.body.Prijs,
                    "Personen": parseInt(req.body.Personen) || 1,
                    "Ingredienten": {},
                    "Stappen": req.body.Stappen ? Array.isArray(req.body.Stappen) ? req.body.Stappen : [req.body.Stappen] : [], //copilot code
                    "tags": req.body.CB || {} //CB is een dict die alle checkboxes bevat (zie recipeAdd.ejs)
                }
            }; 
        if (!Array.isArray(req.body.Ingredient)) {
            newRecipe.Recept.Ingredienten[req.body.Ingredient.key] = req.body.Ingredient.value; 
        } else {
        req.body.Ingredient.forEach((ingredient, index) => {
            newRecipe.Recept.Ingredienten[ingredient] = req.body.Hoeveelheid[index];
        })};


        recipes.push(newRecipe);
        ids.push(generatedId);
        
        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
        fs.writeFileSync('./data/ids.json', JSON.stringify(ids, null, 2));
        console.log("data has been updated");
        
        res.redirect("/recipes")
    });
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
        "Id": generateId(req.body.Naam) || 0, //TODO: da besta nog ni LMAOOOOOOOOOO
        "Naam": req.body.Naam || "Naamloos recept",
        "Prijs": req.body.Prijs,
        "Personen": parseInt(req.body.Personen) || 1,
        "Ingredienten": {},
        "Stappen": req.body.Stappen ? Array.isArray(req.body.Stappen) ? req.body.Stappen : [req.body.Stappen] : [], //Stappen als isarray anders in array steken
        "tags": req.body.CB || {} //CB is een dict die alle checkboxes bevat (zie recipeAdd.ejs)
    };
    console.log(req.body.Ingredient.key);
    if (!Array.isArray(req.body.Ingredient)) {
        console.log(req.body)
        updatedRecipe.Ingredienten[req.body.Ingredient] = req.body.Hoeveelheid; 
    } else {
    req.body.Ingredient.forEach((ingredient, index) => {
        updatedRecipe.Ingredienten[ingredient] = req.body.Hoeveelheid[index];
    }
    )};

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
