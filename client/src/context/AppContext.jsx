import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", backendUrl);
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");


    // fetch seller status
    const fetchSellerStatus = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth", { withCredentials: true });
            if(data.success){
                setIsSeller(true)
            }
            else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false);
            console.error("Seller status fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch User Auth status , User Data and Cart Data
    const fetchUser = async () => {
        try {
            const {data} = await axios.get("/api/user/is-auth", {withCredentials: true});
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            }else{
                setUser(null);
                setCartItems({});
            }
        } catch (error) {
            console.error("User auth fetch failed:", error);
            setUser(null);
            setCartItems({});
        }
    }





    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if(data.success){
                setProducts(data.products || []);
            }
            else{
                setProducts([]);
                console.error("Failed to fetch products:", data.message);
            }
        } catch (error) {
            setProducts([]);
            console.error("Error fetching products:", error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchSellerStatus();
        fetchProducts();
    }, []);

    useEffect(() => {
        const updateCart = async () => {
            try {
                const {data} = await axios.post("/api/cart/update", {cartItems}, {withCredentials: true});
                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error updating cart:", error.message);
                toast.error(error.response?.data?.message || "Failed to update cart");
            }
        }
        if(user && Object.keys(cartItems).length > 0){
            updateCart();
        }
    },[cartItems, user])

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) delete cartData[itemId];
        }
        setCartItems(cartData);
        toast.success("Removed From Cart");
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find(p => p._id === itemId);
            if (itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        isLoading,
        showUserLogin,
        setShowUserLogin,
        products,
        setProducts,
        currency,
        addToCart,
        cartItems,
        setCartItems,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        toast,
        fetchProducts,
        fetchUser,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => useContext(AppContext);

export {
    useAppContext,
    AppContext,
    AppContextProvider,
};
