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

  function resetFilter() {
    document.getElementById("highprotein-checkbox").checked = false;
    document.getElementById("lowcarb-checkbox").checked = false;
    document.getElementById("diet-dropdown").value = "none";
    fetchRecipes();
  }
  
  async function fetchRecipes() {
    const highprotein = document.getElementById("highprotein-checkbox").checked;
    const lowcarb = document.getElementById("lowcarb-checkbox").checked;
    const diet = document.getElementById("diet-dropdown").value;
    var preferencesArray = [
      { name: "proteins", value: highprotein },
      { name: "carbs", value: lowcarb },
      { name: "diet", value: diet }
    ];
     // Store the array in localStorage as a string
    localStorage.setItem('preferences', JSON.stringify(preferencesArray));

    // Retrieve the array from localStorage and parse it to an array
    var storedPreferences = JSON.parse(localStorage.getItem('preferences'));

    // Find the proteins object in the array and log its value
    var proteinsObj = storedPreferences.find(item => item.name === 'proteins');
    var carbsObj = storedPreferences.find(item => item.name === 'carbs');
    var dietObj = storedPreferences.find(item => item.name === 'diet');
    
    let proteinFilter = 0;
    let carbohydrateFilter = 200;
    if (proteinsObj.value === true) {
      proteinFilter = 15;
    }
    if (carbsObj.value === true) {
      carbohydrateFilter = 50;
    }
    recipeGrid.innerHTML = "";
    if (dietObj.value === "vegan") {
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
      });
    } else {
      const { data, error } = await supabase
      .from('recipes')
      .select()
      .gte('protein', proteinFilter)
      .lte('carbohydrate', carbohydrateFilter)
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
      
      <button id="filterButton" onClick={fetchRecipes}>Search</button>
      <button id="resetFilterButton" onClick={resetFilter}>Reset Filter</button>
      <br/>
      <br/>
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



export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } }
  }

  return { props: { user } }
}