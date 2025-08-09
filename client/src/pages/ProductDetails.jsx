import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard"; // ensure it's imported

const ProductDetails = () => {
  const { products, navigate, currency, addToCart, isLoading } = useAppContext();
  const { id } = useParams();

  const product = products?.find((item) => item._id === id);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  // Build related products only when products AND product are available
  useEffect(() => {
    if (products?.length > 0 && product) {
      // First try to find products in the same category
      let sameCategory = products
        .filter(
          (item) =>
            item._id !== product._id &&
            item.category?.toLowerCase() === product.category?.toLowerCase()
        )
        .slice(0, 5);
      
      // If no products in same category, show other products
      if (sameCategory.length === 0) {
        sameCategory = products
          .filter((item) => item._id !== product._id)
          .slice(0, 5);
      }
      
      setRelatedProducts(sameCategory);
    }
  }, [products, product]);

  // Set initial thumbnail when product arrives
  useEffect(() => {
    setThumbnail(product?.image?.[0] ?? null);
  }, [product]);

  // If product doesn't exist (bad id), render nothing (your pattern) or a fallback
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-16 mt-4">
            <div className="flex gap-3">
              <div className="flex flex-col gap-3">
                {Array(4).fill('').map((_, index) => (
                  <div key={index} className="w-24 h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="w-96 h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-6 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return product && (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category?.toLowerCase?.() || ""}`}> {product.category}</Link> /
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {(product.image || []).map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 w-96 rounded overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500/70 p-8">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill(0).map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : (assets.star_dull_icon || assets.star_dull_icon)}
                alt=""
                className="md:w-4 w-3.5"
              />
            ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: {currency}{product.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {(product.description || []).map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product._id); navigate("/cart"); }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-3 gap-3 md:gap-6 mt-6">
            {Array(5).fill('').map((_, index) => (
              <div key={index} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {relatedProducts.filter((p) => p.inStock).length === 0 ? (
              <div className="text-center py-8 mt-6">
                <p className="text-gray-500">No related products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-3 gap-3 md:gap-6 mt-6">
                {relatedProducts.filter((p) => p.inStock).map((p, index) => (
                  <ProductCard key={p._id || index} product={p} />
                ))}
              </div>
            )}
          </>
        )}
        <button
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
