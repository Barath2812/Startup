import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setShowUserLogin, setUser, setIsSeller, axios, toast } = useAppContext();
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('user'); // 'user' or 'seller'
    const [state, setState] = useState("login"); // 'login' or 'register'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            if (loginType === 'user') {
                // User login/register
                const { data } = await axios.post(`/api/user/${state}`, {
                    name,
                    email,
                    password,
                });
                if (data.success) {
                    toast.success(state === "login" ? "Login successful!" : "Account created successfully!");
                    navigate("/");
                    setUser(data.user);
                    setShowUserLogin(false);
                    // Clear form
                    setName("");
                    setEmail("");
                    setPassword("");
                } else {
                    toast.error(data.message);
                }
            } else {
                // Seller login
                const { data } = await axios.post('/api/seller/login', { email, password }, {
                    withCredentials: true
                });
                if (data.success) {
                    toast.success("Seller login successful!");
                    setIsSeller(true);
                    navigate("/seller");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='bg-white rounded-lg shadow-xl border border-gray-200 p-8'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold text-gray-900'>
                            Welcome Back
                        </h2>
                        <p className='mt-2 text-sm text-gray-600'>
                            Sign in to your account
                        </p>
                    </div>

                    {/* Login Type Dropdown */}
                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Login as
                        </label>
                        <select
                            value={loginType}
                            onChange={(e) => setLoginType(e.target.value)}
                            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                        >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-6'>
                        {/* Name field - only for user registration */}
                        {loginType === 'user' && state === "register" && (
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Name
                                </label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="Enter your name"
                                    className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                    type="text"
                                    required
                                />
                            </div>
                        )}

                        {/* Email field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Email
                            </label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="Enter your email"
                                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                type="email"
                                required
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Password
                            </label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter your password"
                                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                type="password"
                                required
                            />
                        </div>

                        {/* Toggle between login and register - only for users */}
                        {loginType === 'user' && (
                            <div className='text-center'>
                                {state === "register" ? (
                                    <p className='text-sm text-gray-600'>
                                        Already have an account?{' '}
                                        <button
                                            type='button'
                                            onClick={() => setState("login")}
                                            className='text-primary hover:text-primary-dull font-medium'
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                ) : (
                                    <p className='text-sm text-gray-600'>
                                        Don't have an account?{' '}
                                        <button
                                            type='button'
                                            onClick={() => setState("register")}
                                            className='text-primary hover:text-primary-dull font-medium'
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type='submit'
                            className='w-full bg-primary hover:bg-primary-dull transition-all text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={loading}
                        >
                            {loading ? "Please wait..." : (
                                loginType === 'user' 
                                    ? (state === "register" ? "Create Account" : "Sign In")
                                    : "Seller Login"
                            )}
                        </button>
                    </form>

                    {/* Back to home */}
                    <div className='mt-6 text-center'>
                        <button
                            onClick={() => navigate('/')}
                            className='text-sm text-gray-600 hover:text-gray-800'
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 