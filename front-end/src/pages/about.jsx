import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const about = () => {
  return (
    <div>
       <div className='text-2xl text-center pt-8 border-t'>
            <Title text1={'ABOUT'} text2={'US'}/>
       </div>

       <div className='my-10 flex flex-col md:flex-row gap-16'>
                 <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, voluptatem fugiat nam, ab nobis aliquid adipisci delectus pariatur quisquam reprehenderit ratione ad, saepe beatae soluta!</p>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita veritatis consequatur consequuntur aliquid, repellendus pariatur aperiam accusantium in odio beatae fugiat architecto saepe! Ipsum, maiores.</p>
                          <b className='text-gray-800'>Our Mission</b>
                          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt modi delectus fugiat itaque dolore accusantium doloribus magnam quidem dolor eaque, incidunt blanditiis sint facere eum est, ex enim! Velit, id!</p>
                </div>
       </div>

       <div className='text-xl py-4 '>
               <Title text1={'WHY '} text2={'CHOOSE US'}/>
       </div>

        <div className='flex flex-col md:flex-row text-sm mb-20'>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                  <b>Quantity Assurance:</b>
                  <p  className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ea laborum eveniet quo, perferendis facilis quae tenetur unde id reprehenderit. Odit minus ad non esse?</p>
              </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                  <b>Convenience:</b>
                  <p  className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis temporibus laborum quisquam molestiae voluptatem quo, ab sapiente eos expedita commodi dolorem, quidem illo suscipit repudiandae!</p>
              </div>
               <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                  <b>Exceptional Customer Service:</b>
                  <p  className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus et id quo soluta aut laudantium accusamus nostrum error quae impedit.</p>
              </div>
        </div>
      <NewsletterBox />
    </div>
  )
}

export default about
