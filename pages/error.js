import { useState, useEffect } from 'react';
import { supabase } from '../client'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Profile() {
  const router = useRouter()
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      {typeof window !== 'undefined' &&
        <label>
          <input type="checkbox" className="alertCheckbox" autoComplete="off" />
          <div className="alert error">
            <span className="alertClose">X</span>
            <span className="alertText">{localStorage.getItem('error')}
              <br className="clear" /></span>
          </div>
        </label>}
      <Link href="/sign-in">
        <button id="logoutButton">Back to Login</button>
      </Link>
    </div>
  )

}