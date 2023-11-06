import { useState, useEffect } from 'react';
import { supabase } from '../client'
import { useRouter } from 'next/router'
import Image from 'next/image'


export default function Profile() {
  const [profile, setProfile] = useState(null)
  const router = useRouter()
  useEffect(() => {
    fetchProfile();
  }, [])
  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      router.push('/sign-in')
    } else {
    setProfile(profileData)
    }
  }
  async function signOut() {
    await supabase.auth.signOut()
    localStorage.clear();
    router.push('/sign-in')
  }
  if (!profile) return null
  if (profile.user_metadata) {
    localStorage.setItem("userID", profile.id)
    return (
      <div id="profile">
        <h2>Hey {profile.user_metadata.full_name}</h2>
        <br />
        <Image
          width="100%" height="100%"
          src={profile.user_metadata.avatar_url}
          alt="Avatar" />
        <br />
        <br />
        <p>{profile.email}</p>
        <button id="logoutButton" onClick={signOut}>Sign Out</button>

      </div>)
  } else {
    return (
      <div style={{ maxWidth: '420px', margin: '96px auto' }}>
        <h2>Hello, {profile.email}</h2>
        <p>User ID: {profile.id}</p>
        <button id="logoutButton" onClick={signOut}>Sign Out</button>
      </div>
    )
  }
}