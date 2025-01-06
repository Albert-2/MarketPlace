import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/userSlice"; // Path to your userSlice

function AddProduct() {
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    quantity: 1, // Add image field
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, userId, image: reader.result }); // Set Base64 string
      };
      reader.readAsDataURL(file); // Convert to Base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => navigate("/"));
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Add Product
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg space-y-6"
      >
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Name:
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Description:
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="block w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows="2"
            placeholder="Product description"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Price:
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="block w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Product price"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Quantity:
          </label>
          <input
            type="number"
            min={1}
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="block w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Product quantity"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Image:
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:py-3 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-blue-100 file:text-blue-700 file:hover:bg-blue-200"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
