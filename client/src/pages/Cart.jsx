import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import GooglePayButton from "../components/GooglePayButton";
import RazorpayButton from "../components/RazorpayButton";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    toast,
    user,
    setCartItems,
  } = useAppContext();

  // Guard against missing/empty addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [cartArray, setCartArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [googlePayLoading, setGooglePayLoading] = useState(false);

  const getCart = () => {
    if (!products || !cartItems) return;

    const tempArray = [];
    for (const key in cartItems) {
      // Coerce both to string to avoid ObjectId/number vs string mismatch
      const product = products.find((p) => String(p._id) === String(key));
      if (!product) continue; // skip missing products instead of crashing
      // Don’t mutate original product
      tempArray.push({
        ...product,
        quantity: cartItems[key],
      });
    }
    setCartArray(tempArray);
  };

  const getAddresses = async () => {
    setAddressLoading(true);
    try {
      const {data} = await axios.get("/api/address/get", {withCredentials: true});
      if(data.success){
        setAddresses(data.addresses);
        if(data.addresses.length > 0){
          setSelectedAddress(data.addresses[0]);
        }
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setAddressLoading(false);
    }
  }

  const placeOrder = async () => {
    if(!selectedAddress){
      toast.error("Please select an address");
      return;
    }
    
    if(cartArray.length === 0){
      toast.error("Your cart is empty");
      return;
    }

    if (paymentOption === "COD") {
      setLoading(true);
      try {
        const {data} = await axios.post("/api/order/cod", {
          items : cartArray.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          addressId: selectedAddress._id,
        }, {withCredentials: true});
        
        if(data.success){
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error(error.response?.data?.message || "Failed to place order");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRazorpaySuccess = async (paymentData) => {
    if(!selectedAddress){
      toast.error("Please select an address");
      return;
    }
    
    if(cartArray.length === 0){
      toast.error("Your cart is empty");
      return;
    }

    setGooglePayLoading(true);
    try {
      const {data} = await axios.post("/api/order/razorpay/verify", {
        items : cartArray.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        addressId: selectedAddress._id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature
      }, {withCredentials: true});
      
      if(data.success){
        toast.success(data.message);
        setCartItems({});
        navigate("/my-orders");
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setGooglePayLoading(false);
    }
  };

  const handleRazorpayError = (error) => {
    console.error("Razorpay error:", error);
    toast.error("Payment failed. Please try again.");
  };

  useEffect(() => {
    if(user){
      getCart();
      getAddresses();
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if(!user){
      navigate("/");
      toast.error("Please login to view your cart");
    }
  }, [user, navigate, toast]);

  // Show loading or empty states
  if (!user) return null;
  if (!Array.isArray(products) || products.length === 0) return null;
  if (!cartItems || Object.keys(cartItems).length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-medium mb-6">Shopping Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()}</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/products/${String(product.category).toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img className="max-w-full h-full object-cover" src={product.image?.[0]} alt={product.name} />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      name="quantity"
                      id="quantity"
                      className="outline-none"
                      value={cartItems[String(product._id)] || product.quantity || 1}
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                    >
                      {Array(Math.max(cartItems[String(product._id)] || 1, 9))
                        .fill("")
                        .map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice || 0) * (product.quantity || 1)}
            </p>
            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                alt="remove"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#FF532E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <svg
            className="group-hover:translate-x-1 transition"
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            alt="arrow"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            {addressLoading ? (
              <p className="text-gray-500">Loading addresses...</p>
            ) : (
              <p className="text-gray-500">
                {selectedAddress
                  ? ` ${selectedAddress.street} , ${selectedAddress.city} , ${selectedAddress.state} , ${selectedAddress.country}`
                  : "No address found"}
              </p>
            )}
            <button 
              onClick={() => setShowAddress(!showAddress)} 
              disabled={addressLoading}
              className="text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addressLoading ? (
                  <p className="text-gray-500 p-2 text-center">Loading addresses...</p>
                ) : addresses.length > 0 ? (
                  addresses.map((address, i) => (
                    <p
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      key={`${address.street}-${i}`}
                      className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {address.street} , {address.city} , {address.state} , {address.country}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 p-2 text-center">No addresses found</p>
                )}
                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select onChange={(e) => setPaymentOption(e.target.value)} value={paymentOption} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment (Razorpay)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {paymentOption === "COD" 
              ? "Pay when you receive your order" 
              : "Pay securely with Razorpay"
            }
          </p>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency} {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        {paymentOption === "COD" ? (
          <button 
            onClick={placeOrder} 
            disabled={loading}
            className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : "Place Order"}
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            <RazorpayButton
              amount={(getCartAmount() * 1.02).toFixed(2)}
              orderId={`order_${Date.now()}`}
              items={cartArray.map((item) => ({ productId: item._id, quantity: item.quantity }))}
              addressId={selectedAddress?._id}
              customer={{
                name: user?.name,
                email: user?.email,
                contact: user?.phone,
                address: selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : ''
              }}
              onSuccess={handleRazorpaySuccess}
              onError={handleRazorpayError}
              disabled={googlePayLoading}
            />
            {googlePayLoading && (
              <p className="text-center text-sm text-gray-500">
                Processing payment...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
