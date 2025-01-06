import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/productsSlice";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import { useSelector } from "react-redux";

function Home() {
  const [products, setProducts2] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const dispatch = useDispatch();
  const products2 = useSelector((state) => state.products.products);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_DOMAIN}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts2(data);
        dispatch(setProducts(data));
        setFilteredProducts(data);

        const shuffled1 = [...data].sort(() => 0.5 - Math.random());
        setPopularProducts(shuffled1.slice(0, 4));
        const shuffled2 = [...data].sort(() => 0.5 - Math.random());
        setSalesProducts(shuffled2.slice(0, 4));
      });
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      {/* Carousel */}
      <Carousel />
      {/* Search Bar */}
      <div className="container mx-auto py-4 px-4">
        {/* Popular Products */}
        <h2 className="text-2xl font-semibold mb-4">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product._id} product={product} btnShow={true} />
          ))}
        </div>

        {/* Sales Section */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">On Sale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {salesProducts.map((product) => (
            <ProductCard key={product._id} product={product} btnShow={true} />
          ))}
        </div>

        {/* Categories Section */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/category/mens-wear"
            className="category-card bg-blue-100 rounded-lg p-6 text-center shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">Men's Wear</h3>
          </Link>
          <Link
            to="/category/womens-wear"
            className="category-card bg-pink-100 rounded-lg p-6 text-center shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">Women's Wear</h3>
          </Link>
          <Link
            to="/category/child-wear"
            className="category-card bg-green-100 rounded-lg p-6 text-center shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">Child Wear</h3>
          </Link>
          <Link
            to="/category/accessories"
            className="category-card bg-yellow-100 rounded-lg p-6 text-center shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">Accessories</h3>
          </Link>
        </div>

        {/* Products Section */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">All Products</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full sm:w-1/3 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} btnShow={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
