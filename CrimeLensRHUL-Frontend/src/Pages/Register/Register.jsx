import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    s;
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Basic password validations
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\/-]/.test(password)) {
      toast.error("Password must contain at least one special character.");
      return;
    }

    try {
      // 1. Create the user
      const result = await createUser(email, password);
      toast.success("Account created successfully!");

      // 2. Update profile
      await updateProfile(result.user, { displayName: name });

      // 3. Create accessibility profile via your API
      await axios.post("http://localhost:9001/accessibility", { email });

      // 4. Navigate to home
      setTimeout(() => {
        navigate("/");
      }, 1600);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Helmet>
        <title>Register</title>
        <meta name="description" content="RZA Registration" />
      </Helmet>

      {/* Left Side: Register Form */}
      <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-white text-3xl text-center mb-8">Register</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="text-white block mb-2 text-lg">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name*"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                required
              />
            </div>
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
            {/* Phone Number */}
            <div>
              <lable className="text-white block mb-2 text-lg">
                Phone Number
              </lable>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number*"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                required
              />
            </div>
            {/* Location */}
            <div>
              <label className="text-white block mb-2 text-lg">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Location*"
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
                Register
              </button>
            </div>
          </form>

          {/* Already Registered? */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-white text-lg underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      >
      </div>

    </div>
  );
};

export default Register;
