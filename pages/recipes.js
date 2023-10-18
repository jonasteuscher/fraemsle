import { supabase } from '../client'
import Image from 'next/image'

export default function Recipes({ user }) {
  fetchRecipes();
  return (
      <div>
      <header>
        <div className="signetbild">
          <Image width="100%" height="100%" src="/public/img/signet.png" alt="signet" />
        </div>

      </header>
      <main>
        <h4>Recipe Collection</h4>
        <section className="recipe-grid" id="recipeGrid">
        </section>
      </main>
      </div>
  )
}

async function fetchRecipes() {
  try {
    const { data, error } = await supabase.from("recipes").select();
    if (error) console.log("error", error);
    else {
      // Populate the recipe grid with data
      data.forEach(recipe => {
        const recipeCard = `
        <div class="recipe-card" id="${recipe.id}" onClick="localStorage.setItem('clickedItem', ${recipe.id}); window.location.href='/recipe-detail';">
        <Image src="${recipe.image}" alt="${recipe.title}" width="100%">
        <div class="recipe-container">
        <h2>${recipe.title}</h2>
        <p>${recipe.servings}</p>
        <p>${recipe.time_to_cook} minutes</p>
        </div>
        </div> <br>`;
        if (recipeGrid) {
          recipeGrid.innerHTML += recipeCard;
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