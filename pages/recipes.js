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
  
  async function filterRecipes() {
    const highprotein = document.getElementById("highprotein-checkbox").checked;
    const lowcarb = document.getElementById("lowcarb-checkbox").checked;
    const diet = document.getElementById("diet-dropdown").value;
    let proteinFilter = 0;
    let carbohydrateFilter = 200;
    if (highprotein === true) {
      proteinFilter = 15;
    }
    if (lowcarb === true) {
      carbohydrateFilter = 50;
    }

    recipeGrid.innerHTML = "";
      

    if (diet === "vegan") {
      const { data, error } = await supabase
      .from('recipes')
      .select()
      .eq('vegan', true)
      .gte('protein', proteinFilter)
      .lte('carbohydrate', carbohydrateFilter)
      // Populate the recipe grid with data
      data.forEach(recipe => {
        const isFavorite = checkIfIDExistsInFavorites(recipe.id);
        let favoriteIcon;
        if (isFavorite === true) {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked_empty.png&w=640&q=75" alt="signet" />`;
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
    } else if (diet === "vegetarian") {
      const { data, error } = await supabase
      .from('recipes')
      .select()
      .eq('vegetarian', true)
      .gte('protein', proteinFilter)
      .lte('carbohydrate', carbohydrateFilter)
      // Populate the recipe grid with data
      data.forEach(recipe => {
        const isFavorite = checkIfIDExistsInFavorites(recipe.id);
        let favoriteIcon;
        if (isFavorite === true) {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked_empty.png&w=640&q=75" alt="signet" />`;
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
    } else {
      const { data, error } = await supabase
      .from('recipes')
      .select()
      .gte('protein', proteinFilter)
      .lte('carbohydrate', carbohydrateFilter)
      // Populate the recipe grid with data
      data.forEach(recipe => {
        const isFavorite = checkIfIDExistsInFavorites(recipe.id);
        let favoriteIcon;
        if (isFavorite === true) {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked_empty.png&w=640&q=75" alt="signet" />`;
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
  }
/*
  function toggleFilter() {
    if (document.getElementById("filterGrid").style.display === "none") {
      document.getElementById("filterGrid").style.display = "block";
    } else {
      document.getElementById("filterGrid").style.display = "none";
    }
  }
*/
  return (
      <div>
      <main>
        <h1>Browse recipes</h1>

      <div id='filterGrid'>
      <div className="filterstyle">
          <input id="lowcarb-checkbox" type="checkbox" value="" name="bordered-checkbox"/>
          <label htmlFor="bordered-checkbox-1">Low Carb</label>
      </div>
      <br/>
      <div className="filterstyle">
          <input id="highprotein-checkbox" type="checkbox" value="" name="bordered-checkbox"/>
          <label htmlFor="bordered-checkbox-1">High Protein</label>
      </div> 
      <br/>
      <select id="diet-dropdown" name="diet-dropdown">
        <option value="none">All</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
      
      <button id="filterButton" onClick={filterRecipes}>Search</button>
      </div>
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

async function changeFavorite(recipeID) {
  const isFavorite = checkIfIDExistsInFavorites(recipeID);
  if (isFavorite === true) {
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
      if (error) {
        console.log("error", error);
      }
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
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          favoriteIcon = `<Image id="likeButton${recipe.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fdisliked_empty.png&w=640&q=75" alt="signet" />`;
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