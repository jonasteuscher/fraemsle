import { supabase } from '../client'
import { useEffect } from 'react';
import Image from 'next/image'

export default function Recipes({ user }) {
  useEffect(() => {
    fetchProfile();
    fetchRecipes();
    fetchFavorites();
  }, [])

  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      router.push('/sign-in')
    } else {
      localStorage.setItem("userID", profileData.id)
    }
  }

  async function checkIfIDExistsInFavorites(currentID) {
    
  }

  return (
      <div>
      <header>
        <div className="signetbild">
          <Image width="100%" height="100%" src="/public/img/signet.png" alt="signet" />
        </div>

      </header>
      <main>
        <h1>Recipe Collection</h1>
        <section className="recipe-grid" id="recipeGrid">
        </section>
      </main>
      </div>
  )
}

function checkIfIDExistsInFavorites(currentID) {
    const favorites = JSON.parse(localStorage.getItem("favorites"));
    if (favorites.includes(currentID)) {
      return true;
    } else {
      return false;
    }
}

function listAllEventListeners() {
  const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
  allElements.push(document);
  allElements.push(window);

  const types = [];

  for (let ev in window) {
    if (/^on/.test(ev)) types[types.length] = ev;
  }

  let elements = [];
  for (let i = 0; i < allElements.length; i++) {
    const currentElement = allElements[i];
    for (let j = 0; j < types.length; j++) {
      if (typeof currentElement[types[j]] === 'function') {
        elements.push({
          "node": currentElement,
          "type": types[j],
          "func": currentElement[types[j]].toString(),
        });
      }
    }
  }

  return elements.sort(function(a,b) {
    return a.type.localeCompare(b.type);
  });
}

async function changeFavorite(recipeID) {
  console.log("changeFavorite called with " + recipeID);
  const isFavorite = checkIfIDExistsInFavorites(recipeID);
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
  }

  //fetchFavorites();
  async function fetchFavorites() {
    try {
      const { data, error } = await supabase.from("favorites").select();
      let favorites = [];
      data.forEach(favorite => {
        favorites.push(favorite.recipe_id);
      });
      if (error) console.log("error", error);
      else {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } catch (error) {
        console.error("An error occurred while fetching data", error);
    }
}


async function fetchRecipes() {
  try {
    const { data, error } = await supabase.from("recipes").select();
    if (error) console.log("error", error);
    else {
      // Populate the recipe grid with data
      data.forEach(recipe => {
        const isFavorite = checkIfIDExistsInFavorites(recipe.id);
        let favoriteIcon;
        if (isFavorite === true) {
          console.log(recipe.id + " is " + isFavorite);
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          favoriteIcon = `<Image  id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked.png&w=640&q=75" alt="signet" />`;
        }
        const recipeCard = `
        <div class="recipe-card" id="${recipe.id}" onClick="localStorage.setItem('clickedItem', ${recipe.id}); window.location.href='/recipe-detail';">
          <Image src="${recipe.image}" alt="${recipe.title}" width="100%">
          <div class="recipe-container">
          <h2>${recipe.title}</h2>
          <p>${recipe.servings}</p>
          <p>${recipe.time_to_cook} minutes</p>
          ${favoriteIcon}
          </div>
        </div>      
        `;
        if (recipeGrid) {
          recipeGrid.innerHTML += recipeCard;
        }   
        let buttonName = "likeButton" + recipe.id;
        // add eventlistener to favorite button
        document.getElementById(buttonName).addEventListener("click", function() {
          changeFavorite(recipe.id);
          window.location.reload();
        }); 
        
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