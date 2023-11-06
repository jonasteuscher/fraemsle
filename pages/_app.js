import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../client'
import { useRouter } from 'next/router'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated')
  const [error, setError] = useState()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated')
        router.push('/recipes')
      }
      if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated')
      }
    })
    checkError()
    checkUser()
    return () => {
      authListener.unsubscribe()
    }
  }, [])
  async function checkUser() {
    const user = await supabase.auth.user()
    if (user) {
      setAuthenticatedState('authenticated')
    }
  }
  async function checkError() {
    if (window.location.hash) {
      const errorFromQuery = queryToJson(window.location.hash);
      if (errorFromQuery.error_description && errorFromQuery.error_description.includes('invalid')) {
        router.push('/error')
        localStorage.setItem('error', "The link is invalid or has expired. Please try again.")
      } else {
        localStorage.setItem('error', errorFromQuery.error_description)
      }
    }
  }
  async function handleAuthChange(event, session) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  }
  async function signOut() {
    document.getElementById("nav-toggle").click();
    await supabase.auth.signOut();
    localStorage.clear();
    router.push('/sign-in')
  }
  function queryToJson(queryString) {
    // Removing any leading characters like '#', which are sometimes present in URL hash parameters
    if (queryString.startsWith('#')) {
      queryString = queryString.substring(1);
    }

    // Splitting the query string on each '&'
    const pairs = queryString.split('&');

    // The object where we'll store our query parameters
    const queryObject = {};

    for (let i = 0; i < pairs.length; i++) {
      // Splitting each key-value pair
      const pair = pairs[i].split('=');

      // The first element is the key, the second is the value.
      // We use 'decodeURIComponent' to handle any encoded characters.
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1] || '');

      // Adding the key-value pair to the object
      queryObject[key] = value;
    }

    // Converting the object to a JSON string with formatting (optional)
    return queryObject;
  }

  function backHome() {
    window.location.href = "/";
  }
  return (
    
    <div>
      <title>NutriDish</title>
      <header>
        <div className="signetbild">
          <Image height="80px" width="60px"  src="/img/Logo.png" onClick={backHome} alt="signet" />
        </div>

      </header>

      <div className="navigation">
      <input type="checkbox" className="navigation__checkbox" id="nav-toggle"></input>
      <label htmlFor="nav-toggle" className="navigation__button">
        <span className="navigation__icon" aria-label="toggle navigation menu"></span>
      </label>
      <div className="navigation__background"></div>

      <nav className="navigation__nav" role="navigation">
      <picture>
      <img      src="/img/logout.png"
                  alt="Logout"
                  className="logoutIcon"
                  onClick={signOut}
                />
                </picture>
        <ul className="navigation__list">
          <li className="navigation__item">
            <a href="/" className="navigation__link">Home</a>
          </li>
          <li className="navigation__item">
            <a href="/recipes" className="navigation__link">Recipes</a>
          </li>
          
          <li className="navigation__item">
            <a href="/favorites" className="navigation__link">Favorites</a>
          </li>

          <li className="navigation__item">
            <a href="/profile" className="navigation__link">Profile</a>
          </li>
    </ul>
  </nav>  
  </div>
      
     
      <Component {...pageProps} error={error} />
    </div>
  )
}

const navStyle = {
  margin: 20
}

const linkStyle = {
  marginRight: 10
}

export default MyApp
