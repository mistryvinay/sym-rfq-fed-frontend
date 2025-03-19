import React, { useState, useEffect } from "react";

const NewOrders = () => {
  const initialOrders = [
    {
      quoteId: "D4F23E64",
      valueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day in the future
      currencyPair: "EUR/USD",
      exchangeRate: "1.2140",
      sellCurrency: "EUR",
      sellAmount: "1000.00",
      buyCurrency: "USD",
      buyAmount: "1214.02",
      createdAt: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute ago
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(), // 1 minute in the future
      state: "new",
    },
    {
      quoteId: "B1A23E54",
      valueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day in the future
      currencyPair: "GBP/USD",
      exchangeRate: "1.3890",
      sellCurrency: "GBP",
      sellAmount: "500.00",
      buyCurrency: "USD",
      buyAmount: "694.51",
      createdAt: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute ago
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(), // 1 minute in the future
      state: "new",
    },
    // More sample orders if needed...
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Function to update order on the backend via a PUT request.
  const updateOrderOnBackend = async (order) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${order.quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        console.error("Failed to update order on backend");
      }
    } catch (error) {
      console.error("Error updating order on backend", error);
    }
  };

  // WebSocket: listen for new orders and prepend them to the orders list.
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/orders");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Expect a payload with an "orders" array.
        if (data.orders && Array.isArray(data.orders)) {
          setOrders((prevOrders) => {
            // Prepend new orders and filter out duplicates by quoteId.
            const combined = [...data.orders, ...prevOrders];
            const deduped = combined.filter(
              (order, index, self) =>
                index === self.findIndex((o) => o.quoteId === order.quoteId)
            );
            return deduped;
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Sort orders so that the newest (by createdAt) are displayed first.
  const sortedOrders = orders.slice().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
// Only show orders that are still "new" or "working"
const newFilteredOrders = sortedOrders.filter(
  (order) => order.state === "new" || order.state === "working"
);
const totalPages = Math.ceil(newFilteredOrders.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const currentOrders = newFilteredOrders.slice(startIndex, startIndex + pageSize);

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

  // Update the order's exchange rate in the state, recalc the buy amount,
  // and set its state to "working".
  const handleExchangeRateChange = (e, quoteId) => {
    const newRateNumber = parseFloat(e.target.value);
    const newRateFormatted = isNaN(newRateNumber) ? "0.0000" : newRateNumber.toFixed(4);

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.quoteId === quoteId) {
          const sellAmount = parseFloat(order.sellAmount);
          const calculatedBuyAmount = (sellAmount * parseFloat(newRateFormatted)).toFixed(2);
          return {
            ...order,
            exchangeRate: newRateFormatted,
            buyAmount: calculatedBuyAmount,
            state: "working", // Change state to working immediately
          };
        }
        return order;
      })
    );
  };

  // When the user finishes adjusting the exchange rate (onBlur),
  // update the backend with the final order details.
  // The backend will update the order state (and broadcast to all clients).
  const handleExchangeRateBlur = (quoteId) => {
    const updatedOrder = orders.find((order) => order.quoteId === quoteId);
    if (updatedOrder) {
      updateOrderOnBackend(updatedOrder);
      // Optionally, publish additional event details here.
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="rounded shadow-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-500 p-4">
      <h2 className="text-lg font-semibold mb-4">New Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Quote ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Value Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Currency Pair</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Sell Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Exchange Rate</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Buy Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">State</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Created At</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Expires At</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentOrders.map((order) => (
              <tr key={order.quoteId}>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {order.quoteId}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {new Date(order.valueDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {order.currencyPair}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {order.sellAmount} {order.sellCurrency}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="number"
                    step="0.0001"
                    value={parseFloat(order.exchangeRate).toFixed(4)}
                    onChange={(e) => handleExchangeRateChange(e, order.quoteId)}
                    onBlur={() => handleExchangeRateBlur(order.quoteId)}
                    className="w-24 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {order.buyAmount} {order.buyCurrency}
                </td>
                <td className="px-4 py-2">
                  {order.state === "working" ? (
                    <button
                      onClick={() => handleChatLaunch(order.room_id)}
                      className={`w-24 h-8 border rounded flex items-center justify-center text-xs font-medium ${getStateBadgeClass(order.state)}`}
                    >
                      {order.state.toUpperCase()}
                    </button>
                  ) : (
                    <span className={`w-24 h-8 border rounded flex items-center justify-center text-xs font-medium ${getStateBadgeClass(order.state)}`}>
                      {order.state.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {new Date(order.expiresAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewOrders;