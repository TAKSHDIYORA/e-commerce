import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/shopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/relatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token } = useContext(ShopContext);
  
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  
  // Review form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userReview, setUserReview] = useState('');
  const [userStar, setUserStar] = useState(0);

  // Fetch product data
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/customerReview/getReview`,{productId});
      if (res.data.success) {
        setReviews(res.data.data);
        setAvgRating(res.data.average);
      }
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Handle Add Review
  const handleAddReview = async () => {
    if (!userName || !userEmail || !userReview || userStar === 0) {
      toast.error("Please fill all fields and give a star rating!");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/customerReview/add`, {
        name: userName,
        email: userEmail,
        review: userReview,
        star: userStar,
        productId
      });

      if (res.data.success) {
        toast.success("Review added successfully!");
        setUserName('');
        setUserEmail('');
        setUserReview('');
        setUserStar(0);
        fetchReviews(); // refresh review list
      } else {
        toast.error(res.data.message || "Failed to add review");
      }
    } catch (err) {
      toast.error("Error adding review");
      console.error(err);
    }
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-50 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img
                onMouseEnter={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt=''
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt='' />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < avgRating ? assets.star_icon : assets.star_dull_icon}
                alt=''
                className='w-3.5'
              />
            ))}
            <p className='pl-2 text-gray-500'>({reviews.length})</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>
            {currency}
            {productData.price}
          </p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-black' : ''}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash On Delivery Available On This Product</p>
            <p>Easy Return and Exchange Policy Within 7 Days</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex border-b'>
          
          <b className='border-t border-r px-5 py-3 text-sm'>Reviews ({reviews.length})</b>
        </div>

        {/* Review List */}
        <div className='flex flex-col gap-6 border px-6 py-6 text-sm text-gray-700'>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className='border-b pb-4'>
                <div className='flex items-center gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < r.star ? assets.star_icon : assets.star_dull_icon}
                      alt=''
                      className='w-3.5'
                    />
                  ))}
                  <p className='font-medium ml-2'>{r.name}</p>
                </div>
                <p className='text-gray-500 mt-1'>{r.review}</p>
              </div>
            ))
          ) : (
            <p className='text-gray-400'>No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Add Review Form */}
        <div className='mt-10 border px-6 py-6 bg-gray-50 rounded-lg'>
          <h2 className='font-semibold mb-4'>Write a Review</h2>
          <div className='flex flex-col gap-3'>
            <input
              type='text'
              placeholder='Your Name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className='border p-2 rounded'
            />
            <input
              type='email'
              placeholder='Your Email'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className='border p-2 rounded'
            />
            <textarea
              placeholder='Your Review...'
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              className='border p-2 rounded'
            ></textarea>

            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((num) => (
                <img
                  key={num}
                  src={num <= userStar ? assets.star_icon : assets.star_dull_icon}
                  alt=''
                  className='w-5 cursor-pointer'
                  onClick={() => setUserStar(num)}
                />
              ))}
            </div>

            <button
              onClick={handleAddReview}
              className='bg-black text-white px-6 py-2 text-sm mt-3 rounded hover:bg-gray-800'
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts Category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'></div>
  );
};

export default Product;
