import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/userSlice";

const PlaceOrder = () => {
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const products = useSelector((state) => state.products.products);
  const buyProduct = products.find((product) => product._id === id);
  const userId = useSelector(selectUserId);

  const states = [
    "Andhra Pradesh",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Delhi",
  ];

  const citiesByState = {
    "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    Delhi: ["New Delhi", "Old Delhi", "Dwarka", "Pitampura"],
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Matches exactly 10 digits
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    fetch(`http://localhost:5000/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: buyProduct._id,
        buyerId: userId,
        quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Not enough stock available") {
          setError(data.message);
        } else if (data.message === "Order has been placed successfully") {
          alert("Order placed successfully");
          setUserName("");
          setPhone("");
          setAddress("");
          setCity("");
          setState("");
          setQuantity(1);
          setError(null);
        }
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Product Details */}
        <div className="md:w-1/2 bg-white p-4 rounded-xl shadow">
          {buyProduct ? (
            <div>
              <img
                src={buyProduct.image}
                alt={buyProduct.name}
                className="w-full h-96 sm:object-contain object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-gray-800">
                {buyProduct.name}
              </h3>
              <p className="text-gray-600 mt-2">{buyProduct.description}</p>
              <p className="text-3xl font-bold text-indigo-600 mt-4">
                ${buyProduct.price}
              </p>
            </div>
          ) : (
            <p className="text-red-600">Product not found</p>
          )}
        </div>

        {/* Right: Order Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            Place Your Order
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your phone number"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter your address"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!state}
                >
                  <option value="">Select City</option>
                  {state &&
                    citiesByState[state]?.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter quantity"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
