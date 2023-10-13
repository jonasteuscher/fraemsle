import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../client'

export default function Home() {
  const [authenticatedState, setAuthenticatedState] = useState(false)
  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      setAuthenticatedState('not-authenticated')
    } else {
      setAuthenticatedState('authenticated')
    }
  }
  fetchProfile();
  return (
    <div>
      <header>
        <div>
          <div id="logobild">
            <Image
              src="/img/Logo.png"
              width="200%"
              height="200%"
              alt="Picture of the author"
            /></div>
          <h1>fr&auml;msle</h1>
          <h2 id="slogan">Discover the power of healthy food!</h2>
          {
            authenticatedState === 'not-authenticated' && (
              <Link href="/sign-in">
                <button id="logoutButton">Sign In</button>
              </Link>
            )}
            </div>
      </header>
    </div>
  )
}