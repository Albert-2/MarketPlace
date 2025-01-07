import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const { productId } = useParams();
  const products = useSelector((state) => state.products.products);
  const product = products.find((product) => product._id === productId);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const handleBuyNow = () => {
    if (isAuthenticated) {
      const id = product._id;
      navigate(`/place-order/${id}`);
    } else {
      navigate("/login");
    }
  };
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <h1 className="text-2xl font-bold text-gray-700">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full mt-20 max-w-6xl mx-auto sm:p-8 p-3 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex items-center justify-center sm:p-6 p-2 ">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain max-h-[32rem] w-full"
          />
        </div>

        <div className="lg:w-1/2 sm:p-6 p-2 flex flex-col justify-between">
          <div className="space-y-4 py-2">
            <h1 className="sm:text-4xl text-lg font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 sm:text-lg text-sm leading-relaxed">
              {product.description}
            </p>
            <p className="text-3xl font-semibold text-blue-600">
              ${product.price}
            </p>
            {product.quantity > 0 ? (
              <p className="text-green-500 font-semibold">In Stock</p>
            ) : (
              <p className="text-red-500 font-semibold">Out of Stock</p>
            )}
          </div>

          <div className="mt-0">
            <button
              onClick={(e) => {
                e.preventDefault(); 
                handleBuyNow();
              }}
              className="font-semibold text-lg text-center w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
