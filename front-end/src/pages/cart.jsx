import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/shopContext'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // you can change this value as needed

  // Build cartData array whenever cartItems change
  useEffect(() => {
    const tempData = []
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          })
        }
      }
    }
    setCartData(tempData)
    setCurrentPage(1) // reset to first page when cart changes
  }, [cartItems])

  // ✅ Calculate indexes for pagination
  const totalPages = Math.ceil(cartData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = cartData.slice(startIndex, endIndex)

  // ✅ Pagination controls
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div>
        {currentItems.map((item, index) => {
          const productData = products.find((product) => product._id === item._id)
          if (!productData) return null

          return (
            <div
              key={index}
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt='' />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate'>{item.size}</p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type='number'
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={assets.bin_icon}
                alt=''
              />
            </div>
          )
        })}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-6 gap-4'>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
            }`}
          >
            Prev
          </button>

          <span className='text-lg font-medium'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Cart Total Section */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/placeOrder')}
              className='bg-black text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
