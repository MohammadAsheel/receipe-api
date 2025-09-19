const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/recipes.json');

function readRecipes() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeRecipes(recipes) {
  fs.writeFileSync(dataPath, JSON.stringify(recipes, null, 2));
}

// GET all recipes
router.get('/', (req, res) => {
  try {
    const recipes = readRecipes();
    res.json(recipes);
  } catch {
    res.status(500).json({ message: 'Error reading recipes.' });
  }
});

// POST new recipe
router.post('/', (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Title, ingredients, and instructions are required.' });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime: cookTime || '',
    difficulty: difficulty || 'medium',
  };

  try {
    const recipes = readRecipes();
    recipes.push(newRecipe);
    writeRecipes(recipes);
    res.status(201).json(newRecipe);
  } catch {
    res.status(500).json({ message: 'Error saving the recipe.' });
  }
});

module.exports = router;
