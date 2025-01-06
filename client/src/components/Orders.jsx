import React from "react";

const Orders = ({
  orders,
  handleWithdrawOrder,
  handleMarkAsDelivered,
  isWithdraw,
}) => {
  // Define an array of background colors
  const backgroundColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  return (
    <div className="h-96 overflow-y-scroll w-full">
      {orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map((order, index) => (
            <li
              key={order._id}
              className={`${
                backgroundColors[index % backgroundColors.length]
              } space-y-3 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 py-2`}
            >
              {/* Order Details */}
              <div className="w-full px-4 space-y-2">
                <div className="w-full">
                  <h1 className="text-2xl font-bold text-gray-800 w-full mb-4">
                    {order.name}
                  </h1>
                  <span>
                    Status:
                    <span
                      className={`${
                        isWithdraw ? "text-yellow-500" : "text-green-600"
                      } font-semibold mx-1`}
                    >
                      {isWithdraw ? "Pending" : "Delivered"}
                    </span>
                  </span>
                </div>

                <div className="space-x-3 text-gray-600">
                  <span>
                    <strong>Quantity:</strong> {order.quantity}
                  </span>
                  <span>
                    <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-x-2 px-4 font-semibold">
                {isWithdraw && (
                  <button
                    onClick={() => handleWithdrawOrder(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200"
                  >
                    Withdraw
                  </button>
                )}
                {isWithdraw && order.status === "Pending" && (
                  <button
                    onClick={() => handleMarkAsDelivered(order._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all duration-200"
                  >
                    Delivered
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">
          No {isWithdraw ? "pending" : "delivered"} orders.
        </p>
      )}
    </div>
  );
};

export default Orders;
