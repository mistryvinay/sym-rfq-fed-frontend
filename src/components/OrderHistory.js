import React, { useState, useEffect } from "react";

// Add this AnimatedRow component at the top of OrderHistory.js
const AnimatedRow = ({ children }) => {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(timeout);
  }, []);
  return <tr className={pulse ? "animate-pulse" : ""}>{children}</tr>;
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let ws;
    let reconnectTimeout;
    const connect = () => {
      ws = new WebSocket("ws://localhost:8000/ws/orders");
      ws.onopen = () => {
        console.log("WebSocket connected in OrderHistory");
      };
      ws.onmessage = (event) => {
        console.log("Received order update in OrderHistory:", event.data);
        try {
          const data = JSON.parse(event.data);
          let incomingOrders = [];
          if (data.orders) {
            incomingOrders = Array.isArray(data.orders) ? data.orders : [data.orders];
          } else if (data.order) {
            incomingOrders = [data.order];
          }
          // Filter incoming orders: only accepted or cancelled orders are relevant to history.
          const filteredOrders = incomingOrders.filter(
            (order) => order.state === "accepted" || order.state === "cancelled"
          );
          if (filteredOrders.length > 0) {
            setOrders((prevOrders) => {
              let updatedOrders = [...prevOrders];
              filteredOrders.forEach((incoming) => {
                const idx = updatedOrders.findIndex(
                  (o) => o.quoteId === incoming.quoteId
                );
                if (idx > -1) {
                  updatedOrders[idx] = incoming;
                } else {
                  updatedOrders.unshift(incoming);
                }
              });
              return updatedOrders;
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message in OrderHistory", error);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error in OrderHistory:", error);
        ws.close();
      };
      ws.onclose = () => {
        console.log(
          "WebSocket disconnected in OrderHistory, attempting reconnect in 5 seconds"
        );
        reconnectTimeout = setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      clearTimeout(reconnectTimeout);
      ws && ws.close();
    };
  }, []);

  // Sort orders descending by createdAt.
  const sortedOrders = orders.slice().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalPages = Math.max(Math.ceil(sortedOrders.length / pageSize), 1);
  const startIndex = (currentPage - 1) * pageSize;
  const currentOrders = sortedOrders.slice(startIndex, startIndex + pageSize);

  // Map order state to CSS badge classes.
  const getStateBadgeClass = (state) => {
    switch (state) {
      case "accepted":
        return "bg-blue-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handlePrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full rounded shadow-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-500 p-4">
      <h2 className="text-lg font-semibold mb-4">Order History</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Quote ID</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Value Date</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Currency Pair</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Sell Amount</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Exchange Rate</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">Buy Amount</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-200">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentOrders.map((order) => (
            <AnimatedRow key={order.quoteId}>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">{order.quoteId}</td>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
                {new Date(order.valueDate).toLocaleString()}
              </td>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">{order.currencyPair}</td>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
                {order.sellAmount} {order.sellCurrency}
              </td>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
                {parseFloat(order.exchangeRate).toFixed(4)}
              </td>
              <td className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
                {order.buyAmount} {order.buyCurrency}
              </td>
              <td className="px-2 py-1">
                <span className={`w-24 h-8 border rounded flex items-center justify-center text-xs font-medium ${getStateBadgeClass(order.state)}`}>
                  {order.state.toUpperCase()}
                </span>
              </td>
            </AnimatedRow>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
          Previous
        </button>
        <span className="px-3 py-1 text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;