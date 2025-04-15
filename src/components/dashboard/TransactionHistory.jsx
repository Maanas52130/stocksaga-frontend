import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filters, setFilters] = useState({
    symbol: "",
    minQuantity: "",
    maxQuantity: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_BASE_URL}/api/transactions/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.transactions || [];
        setTransactions(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
      });
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleQuickDateFilter = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    setFilters((prev) => ({
      ...prev,
      startDate: pastDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    }));
  };

  const clearFilters = () => {
    setFilters({
      symbol: "",
      minQuantity: "",
      maxQuantity: "",
      minPrice: "",
      maxPrice: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    let data = [...transactions];

    if (filters.symbol) {
      data = data.filter((t) =>
        t.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      );
    }
    if (filters.minQuantity) {
      data = data.filter((t) => t.quantity >= Number(filters.minQuantity));
    }
    if (filters.maxQuantity) {
      data = data.filter((t) => t.quantity <= Number(filters.maxQuantity));
    }
    if (filters.minPrice) {
      data = data.filter((t) => t.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      data = data.filter((t) => t.price <= Number(filters.maxPrice));
    }
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      data = data.filter((t) => new Date(t.date) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      data = data.filter((t) => new Date(t.date) <= end);
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "symbol") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        } else if (sortConfig.key === "date") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFiltered(data);
  }, [filters, sortConfig, transactions]);

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 w-full">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">
        📊 Transaction History
      </h2>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Symbol (e.g. AAPL)"
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm"
          value={filters.symbol}
          onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Qty"
            className="border px-3 py-2 rounded-md w-1/2 text-sm"
            value={filters.minQuantity}
            onChange={(e) =>
              setFilters({ ...filters, minQuantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Qty"
            className="border px-3 py-2 rounded-md w-1/2 text-sm"
            value={filters.maxQuantity}
            onChange={(e) =>
              setFilters({ ...filters, maxQuantity: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            className="border px-3 py-2 rounded-md w-1/2 text-sm"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border px-3 py-2 rounded-md w-1/2 text-sm"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
        </div>

        <input
          type="date"
          className="border px-3 py-2 rounded-md text-sm"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          className="border px-3 py-2 rounded-md text-sm"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <button
          onClick={clearFilters}
          className="bg-red-500 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-red-600"
        >
          ❌ Clear Filters
        </button>
      </div>

      {/* Quick Date Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => handleQuickDateFilter(10)}
          className="bg-gray-200 hover:bg-green-100 px-3 py-1 rounded-md text-sm"
        >
          ⏱ Last 10 Days
        </button>
        <button
          onClick={() => handleQuickDateFilter(30)}
          className="bg-gray-200 hover:bg-green-100 px-3 py-1 rounded-md text-sm"
        >
          📅 Last 1 Month
        </button>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {["symbol", "quantity", "price", "date"].map((key) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-3 py-1 rounded-md text-sm text-white transition ${
              sortConfig.key === key
                ? sortConfig.direction === "asc"
                  ? "bg-blue-600"
                  : "bg-blue-400"
                : "bg-blue-500"
            }`}
          >
            ⇅ {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-green-100 text-gray-800 font-medium">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Price/Unit</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((txn, idx) => (
                <tr key={txn._id} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2 font-medium">{txn.symbol}</td>
                  <td
                    className={`border px-4 py-2 capitalize font-semibold ${
                      txn.action === "buy" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {txn.action}
                  </td>
                  <td className="border px-4 py-2">{txn.quantity}</td>
                  <td className="border px-4 py-2">₹{txn.price.toFixed(2)}</td>
                  <td className="border px-4 py-2">₹{txn.totalCost.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No transactions match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
