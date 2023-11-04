import { supabase } from '../client'
import { useEffect } from 'react';
import router from 'next/router';
import Image from 'next/image'

export default function RecipeDetail({ user }) {
  useEffect(() => {
    fetchRecipe();
    checkItem();
  }, [])
  function checkItem() {
    if (localStorage.getItem('clickedItem') === null) {
      router.push('/recipes');
    }
  }
  function backToRecipes() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('clickedItem');
      window.history.go(-1)
    }
  }
  
  return (
    <div>
      <header>
        <div className="signetbild">
          <Image width="100%" height="100%" src="/public/img/signet.png" alt="signet" />
        </div>

      </header>
      <main>
        <h4>Recipe Detail</h4>
        <button id="backButton" onClick={backToRecipes}>Back</button>
        <section className="recipe-detail" id="recipeDetail">
        </section>
      </main>
    </div>
  )
}

async function changeFavorite(recipeID) {
  const isFavorite = await checkIfIDExistsInFavorites(recipeID);
  if (isFavorite === true) {
    console.log(recipeID + " exists in favorites and will be deleted");
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
    console.log("ID does not exist in favorites");
    const { error } = await supabase
    .from('favorites')
    .insert({recipe_id: recipeID, user_id: localStorage.getItem('userID')})
    }
    window.location.reload();
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
        console.log(isFavorite);
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
        <h2>Ingredients</h2>
        <p>${ingredientList}}</p>
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