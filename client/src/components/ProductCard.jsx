import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProductCard({ product, btnShow }) {
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

  return (
    <Link
      to={`/product/${product._id}`}
      state={{ product }}
      className="group border p-4 mb-4 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative overflow-hidden rounded-lg">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain  transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 rounded-lg flex items-end p-4">
          <p className="text-white font-semibold">{product.description}</p>
        </div>
      </div>

      <h2 className="sm:text-xl font-bold mt-4">{product.name}</h2>
      <p className="text-green-500 font-semibold mt-2 sm:text-base text-sm">
        Price: ${product.price}
      </p>

      {product.quantity === 0 && (
        <p className="text-red-500 font-semibold mt-2">Out of Stock</p>
      )}
    </Link>
  );
}

export default ProductCard;
