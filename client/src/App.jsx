import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import PlaceOrder from "./pages/PlaceOrder";
import "./App.css";
import "./index.css";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signin.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Products from "./pages/Products.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./util/ProtectedRoute.jsx"; // Import the ProtectedRoute component

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar className="navbar" />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order/:id"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/user/:userName"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/category/:cat" element={<Products />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
