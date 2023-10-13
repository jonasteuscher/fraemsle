import { supabase } from '../client'

export default function Search({ user }) {
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      <h2>Search</h2>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } }
  }

  return { props: { user } }
}