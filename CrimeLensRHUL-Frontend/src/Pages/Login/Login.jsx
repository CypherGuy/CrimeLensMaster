import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const { signInUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            await signInUser(email, password);
            toast.success("Login Successful.");
            setTimeout(() => {
                navigate("/");
            }, 1600);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
            <Helmet>
                <title>Login</title>
                <meta name="description" content="Login Page" />
            </Helmet>

            {/* Left Side: Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-white text-3xl text-center mb-8">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="text-white block mb-2 text-lg">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email*"
                                className="w-full px-4 py-3 bg-gray-800 border-2 border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                required
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <label className="text-white block mb-2 text-lg">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password*"
                                className="w-full px-4 py-3 bg-gray-800 border-2 border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                required
                            />
                        </div>
                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full bg-white text-black py-3 rounded-lg text-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    {/* Sign Up & Forgot Password Links */}
                    <div className="mt-6 text-center">
                        <Link to="/register" className="text-white text-lg underline">
                            Don't have an account? Register
                        </Link>
                        <br />
                        <Link to="/reset" className="text-white text-lg underline mt-2">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Image */}
            <div
                className="w-full md:w-1/2 h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/background.png')" }}
            >
                <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
                </div>
            </div>
            
            {/* Removed ToastContainer from here */}
        </div>
    );
};

export default Login;
