import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';


const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { axios, toast, currency, user, navigate } = useAppContext();

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get("/api/order/user", {withCredentials: true});
            if(data.success){
                setMyOrders(data.orders);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching my orders:", error);
            toast.error(error.response?.data?.message || "Failed to fetch my orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            fetchMyOrders()
        }
    },[user])

    // Redirect if not logged in
    useEffect(() => {
        if(!user){
            navigate("/");
            toast.error("Please login to view your orders");
        }
    }, [user, navigate, toast]);

    // Show loading or empty states
    if (!user) return null;
    
    if (loading) {
        return (
            <div className='mt-16 pb-16'>
                <div className='flex flex-col items-end w-max mb-8'>
                    <p className='text-2xl font-medium uppercase'>My Orders</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
                <div className="animate-pulse">
                    {Array(3).fill('').map((_, index) => (
                        <div key={index} className='border border-gray-300 rounded-lg p-4 mb-10 max-w-4xl'>
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (myOrders.length === 0) {
        return (
            <div className='mt-16 pb-16'>
                <div className='flex flex-col items-end w-max mb-8'>
                    <p className='text-2xl font-medium uppercase'>My Orders</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No orders found</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

  return (
    <div className='mt-16 pb-16'>
        <div className='flex flex-col items-end w-max mb-8'>
            <p className='text-2xl font-medium uppercase'>My Orders</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        {myOrders.map((order,index)=>(
            <div key={order._id || index} className='border border-gray-300 rounded-lg p-4 mb-10 max-w-4xl'>
                <div className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col mb-4'>
                    <span>Order ID: {order._id}</span>
                    <span>Payment: {order.paymentMethod}</span>
                    <span>Total Amount: {currency}{order.amount}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {order.status}
                    </span>
                </div>
                {order.items && order.items.map((item,itemIndex)=>(
                    <div key={itemIndex} 
                    className={`relative bg-white text-gray-500/70 ${order.items.length !== itemIndex + 1 && 'border-b'} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                        <div className='flex items-center mb-4 md:mb-0'>
                            <div className='bg-primary/10 p-4 rounded-lg'>
                                <img src={item.productId?.image?.[0] || '/placeholder.png'} alt="" className='w-16 h-16 object-cover'/>
                            </div>
                            <div className='ml-4'>
                                <h2 className='text-xl font-medium text-gray-800'>{item.productId?.name || 'Product not found'}</h2>
                                <p>Category: {item.productId?.category || 'N/A'}</p>
                            </div>    
                        </div>
                        <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                            <p>Quantity: {item.quantity || "1"}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className='text-primary text-lg font-medium'>
                            Amount: {currency}{item.productId?.offerPrice ? (item.productId.offerPrice * item.quantity) : 'N/A'}
                        </p>    
                    </div>
                ))}
            </div>
        ))}
    </div>
  )
}

export default MyOrders