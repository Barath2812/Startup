import React from "react";
import { Routes, Route , useLocation} from "react-router-dom"; // ✅ Required!
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import {Toaster} from "react-hot-toast"
import Footer from "./components/Footer.jsx";
import { useAppContext } from "./hooks/useAppContext";
import  Login  from "./components/Login.jsx";
import  AllProducts  from "./pages/AllProducts.jsx";
import  ProductCategory  from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import GooglePayTest from "./components/GooglePayTest.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import Contact from "./pages/Contact.jsx";
import LoginPage from "./pages/Login.jsx";
import SellerLogin from "./components/seller/SellerLogin.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import ProductList from "./pages/seller/ProductList.jsx";
import Orders from "./pages/seller/Orders.jsx";
import Dashboard from "./pages/seller/Dashboard.jsx";



const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin , isSeller, isLoading} = useAppContext();
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar />}

      <Toaster />


      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} `}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element = {<ProductDetails />} />
          <Route path = "/cart" element ={<Cart />} />
          <Route path = "/add-address" element ={<AddAddress />} />
          <Route path = "/my-orders" element = {<MyOrders />} />
          <Route path = "/payment-success" element = {<PaymentSuccess />} />
          <Route path = "/contact" element = {<Contact />} />
          <Route path = "/test-googlepay" element = {<GooglePayTest />} />
          <Route path = '/seller' element ={isLoading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : (isSeller ? <SellerLayout/> : <SellerLogin />)} >
          <Route index element = {isLoading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : (isSeller ? <AddProduct /> : null)} /> 
          <Route path = "dashboard" element = {isLoading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : (isSeller ? <Dashboard /> : null)} />
          <Route path = "product-list" element = {isLoading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : (isSeller ? <ProductList /> : null)} />
          <Route path = "orders" element = {isLoading ? <div className="min-h-screen flex items-center justify-center">Loading...</div> : (isSeller ? <Orders /> : null)} />
          </Route>
        </Routes>  
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
