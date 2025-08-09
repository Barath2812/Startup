import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../hooks/useAppContext';

const BestSeller = () => {
  const { products, isLoading } = useAppContext();
  
  console.log("BestSellers - products:", products?.length || 0);
  console.log("BestSellers - inStock products:", products?.filter(p => p.inStock)?.length || 0);

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      {isLoading ? (
        <div className="flex gap-6 mt-4 overflow-x-auto">
          {Array(5).fill('').map((_, index) => (
            <div key={index} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 mt-4 overflow-x-auto">
          {products
            .slice(0, 5)
            .map((product, index) => (
              <ProductCard key={product._id || index} product={product} />
            ))}
          {products.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No products available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BestSeller;
