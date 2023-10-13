import { useState, useEffect } from 'react';
import { supabase } from '../client'
import { useRouter } from 'next/router'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const router = useRouter()
  useEffect(() => {
    fetchProfile()
  }, [])
  async function update() {
    const { user, error } = await supabase.auth.update({
      data: {
        city: "New York"
      }
    })
  }
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
    router.push('/sign-in')
  }
  if (!profile) return null
  if (profile.user_metadata) {
    return(
    <div>
      <h2>Hello {profile.user_metadata.full_name}</h2>
        <br/>
      <img
        src={profile.user_metadata.avatar_url}
        alt="Avatar" />
        <br/>
        <br/>
      <p>{profile.email}</p>
    </div>)
  } else {
    return (
      <div style={{ maxWidth: '420px', margin: '96px auto' }}>
        <h2>Hello, {profile.email}</h2>
        <p>User ID: {profile.id}</p>
      </div>
    )
  }
}