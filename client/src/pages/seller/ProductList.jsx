import React, { useState } from "react" 
import { useAppContext } from "../../hooks/useAppContext";

const ProductList = () => {
    const [updatingStock, setUpdatingStock] = useState({});
    const {products, currency, fetchProducts, axios, toast } = useAppContext();

    const handleStockChange = async (productId, currentStock) => {
        try {
            setUpdatingStock(prev => ({ ...prev, [productId]: true }));
            
            const { data } = await axios.post('/api/product/stock', {
                id: productId,
                inStock: !currentStock
            }, {
                withCredentials: true
            });

            if (data.success) {
                toast.success('Stock updated successfully');
                // Refresh the product list to show updated stock
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to update stock');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update stock');
        } finally {
            setUpdatingStock(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <div className="no scrollbar flex-1 h[95vh] over-flow-y-scroll flex flex-col justify-between" >
            <div className="w-full md:p-10 p-4">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-medium">All Products</h2>
                    <button 
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull"
                    >
                        Refresh
                    </button>
                </div>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                        No products found. Add your first product!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="border-t border-gray-500/20">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                            <div className="border border-gray-300 rounded overflow-hidden">
                                                <img src={product.image[0]} alt="Product" className="w-16" />
                                            </div>
                                            <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer"
                                                    checked={product.inStock}
                                                    onChange={() => handleStockChange(product._id, product.inStock)}
                                                    disabled={updatingStock[product._id]}
                                                />
                                                <div className={`w-12 h-7 rounded-full peer transition-colors duration-200 ${
                                                    product.inStock ? 'bg-primary' : 'bg-slate-300'
                                                } ${updatingStock[product._id] ? 'opacity-50' : ''}`}></div>
                                                <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                                    product.inStock ? 'translate-x-5' : ''
                                                }`}></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList ;