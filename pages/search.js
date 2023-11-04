import { supabase } from '../client'
import RangeSlider from '../components/Rangeslider';

function rangeSlide(value) {
  document.getElementById('rangeValue').innerHTML = value;
}

export default function Search({ user }) {
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      <h1 className="">Search</h1>
      <RangeSlider
          initialMin={2500}
          initialMax={7500}
          min={0}
          max={10000}
          step={100}
          priceCap={1000}/>
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
