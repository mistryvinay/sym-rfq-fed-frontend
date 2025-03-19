import React, { useState, useEffect } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Listen for orders via WebSocket and keep only orders with state "accepted"
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/orders");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.orders && Array.isArray(data.orders)) {
          setOrders((prevOrders) => {
            const acceptedOrders = data.orders.filter(
              (order) => order.state === "accepted"
            );
            // Combine and deduplicate by quoteId
            const combined = [...acceptedOrders, ...prevOrders];
            const deduped = combined.filter(
              (order, index, self) =>
                index === self.findIndex((o) => o.quoteId === order.quoteId)
            );
            return deduped;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Sort orders descending by createdAt
  const sortedOrders = orders.slice().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalPages = Math.max(Math.ceil(sortedOrders.length / pageSize), 1);
  const startIndex = (currentPage - 1) * pageSize;
  const currentOrders = sortedOrders.slice(startIndex, startIndex + pageSize);

  // Map order state to CSS badge classes.
  const getStateBadgeClass = (state) => {
    switch (state) {
      case "new":
        return "bg-green-500 text-white";
      case "working":
        return "bg-yellow-500 text-white animate-pulse";
      case "accepted":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    // Changed from w-1/2 to w-full so the grid cell defines the width
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
            <tr key={order.quoteId}>
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
            </tr>
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