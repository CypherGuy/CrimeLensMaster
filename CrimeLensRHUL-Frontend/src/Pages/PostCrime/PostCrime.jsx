import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostCrime = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required!");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });

    try {
      setIsUploading(true);
      toast.info("Uploading files...", { autoClose: false });

      const response = await fetch("http://localhost:3000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadedUrls(data.urls);
      toast.dismiss();
      toast.success("Files uploaded successfully!");

      // Submit post data with uploaded URLs
      const postData = {
        title: title.trim(),
        description: description.trim(),
        imageUrls: data.urls,
      };

      console.log("Post submitted:", postData);
      toast.success("Post created successfully!");

      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      console.error("Error during file upload:", error);
      toast.dismiss();
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1B1D] to-[#343738] p-8">
      <div className="w-full max-w-3xl bg-[#1E1F22] p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Create Post</h2>

        {/* Title Input */}
        <label className="block text-lg font-semibold mb-1">Title *</label>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 bg-transparent border border-gray-500 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description Textarea */}
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

        {/* File Upload Section */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-1">Upload Images & Videos</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-white file:text-black
            hover:file:bg-gray-200
            cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {/* Preview Section */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <div className="grid grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded URLs Section */}
        {uploadedUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Uploaded URLs:</h3>
            <div className="space-y-2">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded break-words">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          className="w-full bg-white text-black font-semibold py-3 rounded-full shadow-md hover:bg-gray-200 transition text-lg disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PostCrime;
