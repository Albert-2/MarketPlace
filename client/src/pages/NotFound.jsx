import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/864145814/vector/astronaut-in-outer-space-lost-in-space-flat-concept-illustration.jpg?s=612x612&w=0&k=20&c=I_Q_Y1b_5wxkV1yeveLiCstg-FH3_5lDk5kgd6bx0YQ=')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>{" "}
      {/* Overlay for contrast */}
      <div className="relative z-10 text-center text-white">
        {/* <h1 className="text-9xl font-extrabold">404</h1>
        <p className="text-2xl font-semibold mt-4">Oops! Page not found.</p>
        <p className="mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p> */}
        <Link
          to="/"
          className="mt-64 inline-block px-6 py-3 text-lg font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
