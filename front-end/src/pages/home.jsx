import React, { useContext } from 'react'
import Hero from '../components/hero'
import LatestCollection from '../components/latestCollection'
import BestSeller from '../components/bestseller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import ChatWidget from '../components/ChatWidget'
import { ShopContext } from '../context/shopContext'

const home = () => {
  let {userId} = useContext(ShopContext);
  if(!userId){
    userId = "690f17807fe405fe0c304e44"
  }
  return (
    <div>
      <Hero/>
     
       <ChatWidget userId={`${userId}`}/> 
      <LatestCollection />
      <BestSeller />
      <OurPolicy/>
      <NewsletterBox/>
      
    </div>
  )
}

export default home
