import React , { useState, useEffect } from "react";
import {  assets} from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";


const Orders = () => {
   
    const {currency , axios , toast} = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get("/api/order/seller", {withCredentials: true});
            if(data.success){
                setOrders(data.orders);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect (() =>{
        fetchOrders();
    }, []);
    

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
        <div className="md:p-10 p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Orders List</h2>
                <button 
                    onClick={fetchOrders}
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            
            {loading ? (
                <div className="space-y-4">
                    {Array(3).fill('').map((_, index) => (
                        <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 animate-pulse">
                            <div className="h-12 bg-gray-200 rounded w-32"></div>
                            <div className="h-20 bg-gray-200 rounded w-48"></div>
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No orders found</p>
                    <p className="text-sm text-gray-400">Orders will appear here when customers place them</p>
                </div>
            ) : (
                orders.map((order, index) => (
                <div key={order._id || index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
                    <div className="flex gap-5 max-w-80">
                        <img className="w-12 h-12 object-cover" src={assets.boxicon} alt="boxIcon" />
                        <div>
                            {order.items && order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex flex-col">
                                    <p className="font-medium">
                                        {item.productId?.name || 'Product not found'} {" "}<span className="text-primary">x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm md:text-base text-black/60">
                        {order.addressId ? (
                            <>
                                <p className='text-black/80'>{order.addressId.firstname} {order.addressId.lastname}</p>
                                <p>{order.addressId.street}, {order.addressId.city}</p> 
                                <p>{order.addressId.state}, {order.addressId.pincode}, {order.addressId.country}</p>
                                <p>{order.addressId.phone}</p>
                            </>
                        ) : (
                            <p className="text-gray-500">Address not available</p>
                        )}
                    </div>

                    <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

                    <div className="flex flex-col text-sm md:text-base text-black/60">
                        <p>Method: {order.paymentMethod}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Status: {order.status}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))
            )}
        </div>
        </div>
    );
};

export default Orders;  