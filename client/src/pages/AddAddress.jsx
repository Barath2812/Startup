import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const InputField = ({type , placeholder , name , handleChange , address})=>(
    <input
    className = "w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition "
    type={type} 
    placeholder={placeholder}
    name={name} 
    value = {address[name]}
    onChange={handleChange}
    required
    />
)


const AddAddress = () => {
    const {axios , toast , navigate , user} = useAppContext();
    const [loading, setLoading] = useState(false);

    const [address , setAddress] = useState({
        firstname : "",
        lastname : "",
        email : "",
        street :"",
        city : "",
        state : "",
        pincode : "",
        country : "",
        phone :"",
    })

    const handleChange = (e) =>{
        const {name , value} = e.target;
        setAddress((prevAddress ) =>({
            ...prevAddress,
            [name] : value,
        }))
    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['firstname', 'lastname', 'email', 'street', 'city', 'state', 'pincode', 'country', 'phone'];
        const missingFields = requiredFields.filter(field => !address[field] || address[field].trim() === '');
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
        
        setLoading(true);
        try {
            const {data} = await axios.post("/api/address/add", {address}, {withCredentials: true});
            if(data.success){
                toast.success(data.message);
                navigate("/cart");
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error adding address:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!user){
            navigate("/cart");
        }
    },[user, navigate])

  return (
    <div className='mt-16 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping 
            <span className='text-primary font-semibold'> Address</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className= 'flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

                        <div className='grid grid-cols-2 gap-4' >
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "First Name" name = "firstname" />
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "Last Name" name = "lastname" />
                        </div>
                        <InputField handleChange ={handleChange} address = {address} type = "email" placeholder = "Email" name = "email" />
                        <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "Street" name = "street" />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "City" name = "city" />
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "State" name = "state" /> 
                        </div>    
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "Pin Code" name = "pincode" />
                            <InputField handleChange ={handleChange} address = {address} type = "text" placeholder = "Country" name = "country" /> 
                        </div>
                        <InputField handleChange ={handleChange} address = {address} type = "tel" placeholder = "Phone " name = "phone" />

                        <button 
                            type = "submit" 
                            disabled={loading}
                            className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Saving...' : 'Save Address'}
                        </button>
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0' src = {assets.addressimg} height={1000} width={600} alt="Add Address" />
                
            </div>
    </div>
  )
}
export default AddAddress;
