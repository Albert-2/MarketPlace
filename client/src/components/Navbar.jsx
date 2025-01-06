import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, selectUserId } from "../redux/userSlice";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav className="bg-gray-800 text-white shadow sticky top-0 z-50">
      <div className="container mx-auto py-2 px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Marketplace
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link to={`/user/${userId}`} className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white hover:text-blue-400 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9 9 0 1119.07 7.925M12 14v2m0 4h.01M12 10a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </Link>
          )}
          <button
            className="sm:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="items-center space-x-4 py-2 px-4 sm:flex hidden">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => dispatch(logoutUser())}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signin"
                  className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Signin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${
          isMenuOpen ? "max-h-40" : "max-h-0"
        } overflow-hidden transition-[max-height] duration-300 ease-in-out lg:hidden bg-gray-700`}
      >
        <div className="flex flex-col space-y-2 py-2 px-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => dispatch(logoutUser())}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signin"
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Signin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
