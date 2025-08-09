import React , { useState ,useEffect } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

  const {products, searchQuery, isLoading} = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  console.log("AllProducts - products:", products?.length || 0);
  console.log("AllProducts - filteredProducts:", filteredProducts?.length || 0);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);
  
  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full' ></div>
      </div>
      {isLoading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
          {Array(10).fill('').map((_, index) => (
            <div key={index} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
          {filteredProducts.map((product,index)=>(
            <ProductCard key={product._id || index} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
export default AllProducts;
