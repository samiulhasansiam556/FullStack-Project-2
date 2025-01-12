import { useState, useEffect } from "react";
import axios from "axios";
const url = import.meta.env.VITE_SERVER_URL;
import toast from "react-hot-toast";

export default function AddCoverImages() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const { data } = await axios.get(`${url}/api/admin/products/getcoverimage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data)
      setImages(data); // Update state with fetched images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images when component mounts
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    const token = localStorage.getItem("authtoken");
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(`${url}/api/admin/products/uploadcoverimage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setImages((prev) => [...prev, data.image]);
      setFile(null);
      toast.success("Image uploaded successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authtoken");
    try {
      await axios.delete(`${url}/api/admin/products/deletecoverimage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Upload Cover Images</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Uploaded Images</h3>
        <ul className="space-y-4">
          {images.map((image) => (
            <li
              key={image._id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
            >
              <img
                src={image.imageUrl}
                alt="Cover"
                className="w-16 h-16 object-cover rounded-md"
              />
              <button
                onClick={() => handleDelete(image._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
