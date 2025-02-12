import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sprout } from "lucide-react";
import "./Header.css";

const Header = () => {
  // Destructure setTrees from context.
  const { user, signOutUser, trees, setTrees } = useContext(AuthContext);
  console.log(user, trees);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(false);
  const [urls, setUrls] = useState([]);

  function handleLogOut() {
    signOutUser()
      .then()
      .catch();
    window.location.reload();
  }

  function resetState() {
    setTitle("");
    setDescription("");
    setLocation("");
    setIsUploading(false);
    setSuggestions([]);
    setSelected(false);
    setSubmitted(false);
    setUrls([]);
  }

  function uploadFile(files) {
    const fd = new FormData();
    files.forEach((file) => {
      fd.append("media", file);
    });
    fetch("http://localhost:23232/api/upload", {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUrls(data.imageUrls);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleFileChange(e) {
    setIsUploading(true);
    const files = Array.from(e.target.files);
    uploadFile(files);
  }

  async function handleSearchCountry(location) {
    const response = await fetch(`http://localhost:23232/api/autocomplete?input=${location}`);
    const data = await response.json();
    console.log(data.predictions);
    setSuggestions(data.predictions);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required!");
      return;
    }
    if (!user) {
      toast.error("Please Login");
      return;
    }
    console.log(user);
    console.log(title, description, location, urls);
    const objectToUpload = {
      title,
      description,
      createdBy: user.displayName,
      location: location.split(",")[0],
      media: urls,
      userId: user.uid,
    };
    const JSONData = JSON.stringify(objectToUpload);
    console.log(JSONData);
    try {
      setSubmitted(true);
      const response = await fetch("http://localhost:23232/api/create-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONData,
      });

      if (!response.ok) {
        setSubmitted(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      toast.success("Report uploaded successfully!");
      resetState();
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setIsUploading(false);
      setSubmitted(false);
      console.error(error);
      toast.error(error.message);
    }
  }

  // Fetch the tree count from the API and update the context using setTrees.
  useEffect(() => {
    if (!user) return;
    console.log("Fetching tree count for user", user.uid);
    fetch(`http://localhost:23232/api/get-trees?userId=${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTrees(data.treeCount);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [user, setTrees]);

  return (
    <div className="navbar bg-black text-lg font-semibold py-5 text-white shadow-lg">
      {/* ToastContainer removed from here */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-blue-600 rounded-box w-52">
            <li>
              <NavLink to={"/"} className="text-white hover:bg-purple-500">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/login"} className="text-white hover:bg-purple-500">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to={"/register"} className="text-white hover:bg-purple-500">
                Register
              </NavLink>
            </li>
          </ul>
        </div>
        <Link to={"/"} className="flex items-center gap-3">
          <img className="w-10" src="/CrimeLensLogo.svg" alt="Logo" />
          <h2 className="text-xl font-bold text-white">CrimeLens</h2>
        </Link>
      </div>

      {showModal && (
        <div
          className="fixed z-30 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => {
            setShowModal(false);
            resetState();
          }}
        >
          <div
            className="w-full max-w-3xl bg-[#1E1F22] p-8 rounded-lg shadow-lg text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center">Upload Crime</h2>
            <form className="flex flex-col gap-4 mt-4">
              <label className="block text-lg font-semibold mb-1">Title *</label>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label className="block text-lg font-semibold mb-1">Description *</label>
              <textarea
                placeholder="Description"
                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{ minHeight: "100px" }}
                required
              />
              <label className="block text-lg font-semibold mb-1">Location *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 bg-transparent border border-gray-500 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleSearchCountry(e.target.value);
                  }}
                  required
                />
                {suggestions.length > 0 && !selected && (
                  <div className="z-10 w-full bg-[#2E2F33] rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className="p-2 hover:bg-[#3E3F43] cursor-pointer text-white"
                        onClick={() => {
                          setLocation(suggestion.description);
                          setSuggestions([]);
                          setSelected(true);
                        }}
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-1">
                  {isUploading ? "Uploading..." : "Upload Images & Videos"}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
              {urls.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {urls.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt="Media" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitted || isUploading}>
                Submit
              </button>
            </form>
            <button
              onClick={() => {
                setShowModal(false);
                resetState();
              }}
              className="absolute top-4 right-4 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <button onClick={() => setShowModal(true)} className="btn btn-light">
              Upload Crime
            </button>
            <Link to={"/profile"} className="flex items-center gap-2">
              <img
                src={
                  user.photoURL
                    ? user.photoURL
                    : "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-bold text-white">{user.displayName}</h2>
              <Sprout className="stroke-green-500" size={24} />
              <h2 className="text-lg font-bold text-white">
                {trees ?? "loading Trees..."}
              </h2>
            </Link>
            <button onClick={handleLogOut} className="text-white hover:text-purple-300">
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex gap-8">
            <NavLink to={"/login"} className="text-white hover:text-purple-300">
              Login
            </NavLink>
            <NavLink to={"/register"} className="text-white hover:text-purple-300">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
