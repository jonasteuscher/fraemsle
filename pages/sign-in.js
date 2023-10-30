import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

import { supabase } from '../client'

export default function SignIn() {
  const [alertText, setAlertText] = useState('');

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [redirect, setRedirect] = useState(false)
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signIn({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      console.log({ error })
    } else {
      setRedirect(true);
    }
  }
  async function signInWithFacebook() {
    const { data, error } = await supabase.auth.signIn({
      provider: 'facebook',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      console.log({ error })
    } else {
      setRedirect(true);
    }
  }
  async function signIn() {
    const { error, data } = await supabase.auth.signIn({
      email
    })
    if (error) {
      console.log({ error })
      if (error.message.includes('Email rate limit')) {
        setAlertText('Please wait - you requested too many emails.')
      } else if (error.message.includes('invalid format')) {
        setAlertText('Please enter a valid email address.')
      } else {
        setAlertText(error.message)
      }

    } else {
      setSubmitted(true)
    }
  }
  if (submitted) {
    return (
      <div id="login">
        <header>
          <div>
            <div id="logobild">
              <Image
                src="/public/img/Logo.png"
                width="200%"
                height="200%"
                alt="Logo"
              /></div>
            <h1>NutriDish</h1>
            <br />
          </div>
        </header>
        <h2>Email sent to { email }</h2>
        <h2>Please check your inbox for the magic link!</h2>
      </div>
    )
    }
    if (redirect) {
      return (
        <div id="login">
          <header>
            <div>
              <div id="logobild">
                <Image
                  src="/img/Logo.png"
                  width="200%"
                  height="200%"
                  alt="Logo"
                /></div>
              <h1>NutriDish</h1>
              <br />
            </div>
          </header>
          <h2>Redirecting...</h2>
        </div>
      )
    }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div id="login">
          <header>
            <div>
              <div id="logobild">
                <Image
                  src="/img/Logo.png"
                  width="200%"
                  height="200%"
                  alt="Logo"
                /></div>
              <h1>NutriDish</h1>
              <h2 id="slogan">Discover the power of healthy food!</h2>
            </div>
          </header>
          <main>
            {
              alertText &&
              <label>
                <input type="checkbox" className="alertCheckbox" autoComplete="off" />
                <div className="alert error">
                  <span className="alertClose">X</span>
                  <span className="alertText">{alertText}
                    <br className="clear" /></span>
                </div>
              </label>}
            <input type="email" onChange={e => setEmail(e.target.value)} id="emailInput" placeholder="Enter your email here..." />
            <button id="sendMagicLinkButton" type="submit" onClick={() => signIn()}>Sign In with magic link</button>
            <button id="googleButton" className="login-with-google-btn" onClick={() => signInWithGoogle()}>Continue with Google</button>
          </main>
        </div>

      </main>
    </div>
  )
}
