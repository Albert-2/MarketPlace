import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/userSlice";
import Orders from "../components/Orders";

function UserDashboard() {
  const userId = useSelector(selectUserId);
  const [orders, setOrders] = useState({ delivered: [], pending: [] });
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const username = "User";

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const deliveredOrders = data.filter(
          (order) => order.status === "Delivered"
        );
        const pendingOrders = data.filter(
          (order) => order.status === "Pending"
        );
        setOrders({ delivered: deliveredOrders, pending: pendingOrders });
      });
    console.log(userId);
    fetch(`http://localhost:5000/api/products/userproducts/${userId}`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, [userId]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (product) => {
    setEditProduct(product);
    setUpdatedProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setUpdatedProduct((prev) => ({ ...prev, image: reader.result }));
      };

      reader.readAsDataURL(file);
    } else {
      setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProduct = () => {
    if (!updatedProduct.name || !updatedProduct.price) {
      alert("Name and Price are required.");
      return;
    }

    fetch(`http://localhost:5000/api/products/update/${editProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        image: updatedProduct.image,
        userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedProducts = products.map((product) =>
          product._id === data.product._id ? data.product : product
        );
        setProducts(updatedProducts);
        setEditProduct(null);
      })
      .catch((error) => console.error("Error updating product: ", error));
  };

  const handleWithdrawOrder = (orderId) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this order?"
    );
    if (!confirmWithdraw) return;

    fetch(`http://localhost:5000/api/orders/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        orderId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Order withdrawn successfully") {
          const updatedPendingOrders = orders.pending.filter(
            (order) => order._id !== orderId
          );
          setOrders((prev) => ({
            ...prev,
            pending: updatedPendingOrders,
          }));
          alert("Order withdrawn successfully!");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error withdrawing order: ", error));
  };

  const markOrderAsDelivered = async (orderId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/delivered",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // User ID should be passed accordingly
            orderId: orderId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Update the UI after successfully marking the order as delivered
        alert("Order marked as delivered");

        // Find the order from the pending orders
        const updatedPendingOrders = orders.pending.filter(
          (order) => order._id !== orderId
        );

        // Add the order to delivered orders
        const deliveredOrder = orders.pending.find(
          (order) => order._id === orderId
        );
        const updatedDeliveredOrders = [...orders.delivered, deliveredOrder];

        // Update state without needing to refresh the page
        setOrders({
          delivered: updatedDeliveredOrders,
          pending: updatedPendingOrders,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      alert("Error marking order as delivered");
    }
  };

  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/products/delete/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Optional: If the backend needs userId
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Product deleted successfully") {
          const updatedProducts = products.filter(
            (product) => product._id !== productId
          );
          setProducts(updatedProducts);
          alert("Product deleted successfully!");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error deleting product: ", error));
  };

  return (
    <div className="container p-4  mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your account activities.
        </p>
      </div>

      {/* Orders Section */}
      <div className="mb-8">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-4 cursor-pointer"
          onClick={() => setIsOrdersOpen(!isOrdersOpen)}
        >
          Your Orders
        </h2>
        <div
          className={`transition-all duration-300 ${
            isOrdersOpen ? "max-h-[1000px]" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 sticky top-0">
                Delivered Orders
              </h3>
              <Orders
                orders={orders.delivered}
                handleWithdrawOrder={handleWithdrawOrder}
                isWithdraw={false}
              />
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 sticky top-0">
                Pending Orders
              </h3>
              <Orders
                orders={orders.pending}
                handleWithdrawOrder={handleWithdrawOrder}
                handleMarkAsDelivered={markOrderAsDelivered}
                isWithdraw={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mx-auto">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-4 cursor-pointer"
          onClick={() => setIsProductsOpen(!isProductsOpen)}
        >
          Your Products
        </h2>
        <div
          className={`transition-all duration-300 ${
            isProductsOpen ? "max-h-[1000px]" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500 mb-6 text-center">
              You have no products yet. Add your first product!
            </p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-96 overflow-scroll">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer relative group rounded-lg shadow-md hover:shadow-2xl transform transition-all duration-300 h-64"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end text-center p-4 text-white">
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="mb-2 text-left line-clamp-2 text-sm">
                      {product.description}
                    </p>
                    <span className="font-medium text-lg">
                      Price: ${product.price}
                    </span>
                    <div className="w-full space-x-2 flex items-start">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-lg mt-2 font-semibold sm:text-xl bg-green-500 rounded-md px-4 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-lg mt-2 font-semibold sm:text-xl bg-red-500 rounded-md px-4 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6 text-center">
              No products match your search.
            </p>
          )}

          <Link
            to="/add-product"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition mt-4"
          >
            Add Product
          </Link>
        </div>
      </div>

      {editProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Image:</label>
              <input
                type="file"
                name="image"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setEditProduct(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
