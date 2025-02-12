import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { sendPasswordResetEmail } from 'firebase/auth';
import { database } from '../../firebase/firebase.config'; // Firebase auth reference

const Reset = () => {

  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    try {
      await sendPasswordResetEmail(database, email);
      alert("Check your email");
    } catch (err) {
      alert(err.code);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-gray-900 via-black to-black">
      <Helmet>
        <title>Forgot Password</title>
        <meta name="description" content="RZA Reset Password" />
      </Helmet>

      <div className="w-full max-w-md bg-black bg-opacity-30 rounded-lg p-8">
        <div className="text-center mb-6 text-white text-3xl font-semibold">
            Reset Password
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <input
            name="email"
            type="email"
            className="w-full border-2 border-white px-4 py-3 bg-gray-800 text-white rounded-2xl placeholder-gray-400 !!focus:outline-none focus:border-white"
            placeholder="Enter Email"
            required
          />
          <button
            type="submit"
            className="bg-white text-black text-lg rounded-2xl mt-4 px-2 py-2 font-semibold w-full hover:bg-gray-300 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
