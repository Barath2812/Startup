import React from 'react'
import { useAppContext } from '../context/AppContext'

 const Login = () => {
    const {setShowUserLogin , setUser , axios , navigate , toast} = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const {data} = await axios.post(`/api/user/${state}`, {
                name,
                email,
                password,
            });
            if(data.success){
                toast.success(state === "login" ? "Login successful!" : "Account created successfully!");
                navigate("/");
                setUser(data.user);
                setShowUserLogin(false);
                // Clear form
                setName("");
                setEmail("");
                setPassword("");
            }else{
                toast.error(data.message);
            } 
        }catch (error) {
            console.log(error.message);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }


  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center z-30 text-sm text-gray-600'>
        <form onSubmit={onSubmitHandler} className="relative flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            {/* Close button */}
            <button
                type="button"
                onClick={() => setShowUserLogin(false)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter your name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button 
                className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? "Please wait..." : (state === "register" ? "Create Account" : "Login")}
            </button>
        </form>
    </div>
  )
}

export default Login
