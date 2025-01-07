Marketplace Application
=======================

A modern marketplace application built using the **ERN stack** (Express.js, React, Node.js). The application allows users to browse products, list items for sale, and place orders. It also features authentication, CRUD operations, and state persistence with Redux and Redux-Persist.

Features
--------

*   User authentication (Login/Signup)
*   Browse and search products
*   Add products to the marketplace
*   Place and manage orders
*   Protected routes for logged-in users
*   Dynamic routing for product and user details
*   State management with Redux and Redux-Persist
*   Responsive design using TailwindCSS

* * *

Technologies Used
-----------------

*   **Frontend:** React, React Router, Redux Toolkit, TailwindCSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Airtable used for initial setup)
*   **Authentication:** Firebase Authentication
*   **State Persistence:** Redux-Persist
*   **Routing:** React Router DOM

* * *

Setup Instructions
------------------

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Albert-2/MarketPlace.git
    cd MarketPlace
    npm install
          

3.  **Setup Environment Variables**

In the `server` directory, create a `.env` file with:

    
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
          

In the `client` directory, create a `.env` file with:

       
    VITE_API_DOMAIN="http://localhost:5000
          

4.  **Start the Application**

  
  Start the server:
    
        cd server && npm run dev
    
   Start the client:
    
        cd client && npm run dev
    

5.  **Access the Application**

Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

* * *

Contributing
------------

Contributions are welcome! Please open an issue or submit a pull request if you'd like to contribute to this project.
