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
      window.location.href = '/recipes';
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

async function fetchRecipe() {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select()
      .eq('id', localStorage.getItem('clickedItem'))
    if (error) console.log("error", error);
    else {
      data.forEach(recipe => {
        console.log(recipe);
        const ingredientList = recipe.ingredients.split(',');
        const recipeCardDetail = `
        <div class="" id="${recipe.id}" onClick="localStorage.setItem('clickedItem', ${recipe.id}); window.location.href='/recipe-detail';">
        <Image width="100%" height="100%" src="${recipe.image}" alt="${recipe.title}" width="100%"/>
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
        //document.getElementById(recipe.id).addEventListener("click", () => showDetails(recipe.id));
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