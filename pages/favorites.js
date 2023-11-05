import { supabase } from '../client'
import Image from 'next/image'
import { useState, useEffect } from 'react';


export default function Favorites({ user }) {
  useEffect(() => {
    fetchFavorites()
  }, [])
  return (
    <div>
    <header>
      <div className="signetbild">
        <Image width="100%" height="100%" src="/public/img/signet.png" alt="signet" />
      </div>

    </header>
    <main>
      <h1>Favorites</h1>
      <section className="recipe-grid" id="favoriteGrid">
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

async function fetchFavorites() {
  const favoriteCard = "";
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
        if (favoriteGrid) {
          favoriteGrid.innerHTML += favoriteCard;
        }
      } else {
      data.forEach(favorite => {
        const isFavorite = checkIfIDExistsInFavorites(favorite.recipes.id);
        let favoriteIcon;
        if (isFavorite === true) {
          favoriteIcon = `<Image id="likeButton${favorite.recipes.id}" width="10%" height="20%" src="/_next/image?url=%2Fimg%2Fliked.png&w=640&q=75" alt="signet" />`;
        } else {
          
        }
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
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } }
  }

  return { props: { user } }
}