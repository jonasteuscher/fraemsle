import { supabase } from '../client'
import { useEffect } from 'react';
import router from 'next/router';
import Image from 'next/image'

export default function RecipeDetail({ user }) {
  useEffect(() => {
    if (localStorage.getItem('clickedItem')) {
    fetchRecipe();}
    checkItem();
  }, [])
  function checkItem() {
    if (localStorage.getItem('clickedItem') === null) {
      router.push('/recipes');
    }
  }
  function backToRecipes() {
    if (typeof window !== 'undefined') {
      fetchFavorites();
      fetchRecipe();
      window.localStorage.removeItem('clickedItem');
      window.history.go(-1)
    }
  }
  
  return (
    <div>
      <main id="RecipeDetailPage">
        <h1>Recipe Detail</h1>
        <div id="backButton"><Image width="100%" onClick={backToRecipes} height="100%" src="/img/back.png" alt="back" /></div>
        <section className="recipe-detail" id="recipeDetail">
        </section>
      </main>
    </div>
  )
}

async function changeFavorite(recipeID) {
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  const isFavorite = await checkIfIDExistsInFavorites(recipeID);
  if (isFavorite === true) {
    const filteredItems = favorites.filter((item) => item !== recipeID);
    localStorage.setItem('favorites', JSON.stringify(filteredItems));
    //delete this id from favorites
    const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('recipe_id', recipeID);
    if (error) {
      console.error("Error deleting data:", error);
      return false;
    }
  } else {
    // Add the new recipeID to the favorites array if it doesn't already exist
    favorites.push(recipeID);
    // Update the localStorage with the new favorites array
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const { error } = await supabase
    .from('favorites')
    .insert({recipe_id: recipeID, user_id: localStorage.getItem('userID')})
    }
    window.location.reload();
  }

  async function fetchFavorites() {
    const favoriteCard = "";
    let favoriteGrid;
    const { data, error } = await supabase.from("favorites").select(`
      id, 
      created_at, 
      recipes(id, title, description, ingredients, servings, image, protein, fat, carbohydrate, vegan, vegetarian, recipe_added, time_to_cook)
    `);
      if (error) console.log("error", error);
      else {
        // data is empty
        if (data.length === 0) {
          const favoriteCard = `
          <div>
          <p> No favorites yet. You cann add favorite recipes by clicking on the heart button!</p>
          </div>`;
          if (favoriteGrid !== undefined) {
            favoriteGrid.innerHTML += favoriteCard;
          }
        } else {
        data.forEach(favorite => {
          const isFavorite = checkIfIDExistsInFavorites(favorite.recipes.id);
          let favoriteIcon;
          favoriteIcon = `<Image id="likeButton${favorite.recipes.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
          const favoriteCard = `
          <div class="recipe-card" id="${favorite.recipes.id}" onClick="localStorage.setItem('clickedItem', ${favorite.recipes.id}); window.location.href='/recipe-detail';">
            <Image src="${favorite.recipes.image}" alt="${favorite.recipes.title}" width="100%">
            <div class="recipe-container">
              <h2>${favorite.recipes.title}</h2>
              <p>${favorite.recipes.servings}</p>
              <p>${favorite.recipes.time_to_cook} minutes</p>
              ${favoriteIcon}
            </div>
          </div> <br>`;
          if (favoriteGrid) {
            favoriteGrid.innerHTML += favoriteCard;
          }   
        });
      } 
      }
  }

async function checkIfIDExistsInFavorites(currentID) {
  // check if id is in table favorites
  const { data, error } = await supabase
  .from('favorites')
  .select('recipe_id')
  .eq('recipe_id', currentID)
  .eq('user_id', localStorage.getItem('userID'))
  
  if (error) {
      console.error("Error fetching data:", error);
      return false;
  }
  return data.length > 0;
}

async function fetchRecipe() {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select()
      .eq('id', localStorage.getItem('clickedItem'))
    if (error) console.log("error", error);
    else {
      const isFavorite = await checkIfIDExistsInFavorites(localStorage.getItem('clickedItem'));
      data.forEach(recipe => {
        const ingredientList = recipe.ingredients.split(',');
        let likeButton;
        if (isFavorite === true) {
          likeButton = `<Image id="likeButton" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`
        } else {
          likeButton = `<Image id="likeButton" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked.png&w=640&q=75" alt="signet" />`
        }
        const recipeCardDetail = `
        <div class="" id="${recipe.id}">
        ${likeButton}
        <Image class="recipeimage" width="100%" height="100%" src="${recipe.image}" alt="${recipe.title}" width="100%"/>
        <div class="recipe-container">
        <h1>${recipe.title}</h1>
        <p>Servings: ${recipe.servings}</p>
        <p>Time to cook: ${recipe.time_to_cook} minutes</p>
        <br/>
        <h2>Nutritions (per serving)</h2>
        <p>Proteins: ${recipe.protein}g</p>
        <p>Fat: ${recipe.fat}g</p>
        <p>Carbohydrates: ${recipe.carbohydrate}g</p>
        <br/>
        <h2>Ingredients</h2>
        <p>${ingredientList}</p>
        <br/>
        <h2>Instructions</h2>
        <p>${recipe.description}</p>
        </div>
        </div> <br>`;
        if (recipeDetail) {
          recipeDetail.innerHTML += recipeCardDetail;
        }
        document.getElementById("likeButton").addEventListener("click", () => changeFavorite(recipe.id));
      });
    }
  } catch (error) {
    console.error("An error occurred while fetching data", error);
  }
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } }
  }

  return { props: { user } }
}