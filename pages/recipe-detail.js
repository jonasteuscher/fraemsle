import { supabase } from '../client'
import { useEffect } from 'react';

export default function RecipeDetail({ user }) {
  useEffect(() => {
    fetchRecipe();
  }, [])
  return (
    <div>
      <header>
        <div className="signetbild">
          <img src="../img/signet.png" alt="signet" />
        </div>

      </header>
      <main>
        <h4>Recipe Detail</h4>
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
        const recipeCardDetail = `
        <div class="recipe-card" id="${recipe.id}" onClick="localStorage.setItem('clickedItem', ${recipe.id}); window.location.href='/recipe-detail';">
        <img src="${recipe.image}" alt="${recipe.title}" width="100%">
        <div class="recipe-container">
        <h2>${recipe.title}</h2>
        <p>${recipe.servings}</p>
        <p>${recipe.time_to_cook} minutes</p>
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