import React from 'react'
import Hero from '../components/hero'
import LatestCollection from '../components/latestCollection'
import BestSeller from '../components/bestseller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
const home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection />
      <BestSeller />
      <OurPolicy/>
      <NewsletterBox/>
      
    </div>
  )
}

export default home
