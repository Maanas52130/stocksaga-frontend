import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export default function BuySellForm({ onSubmit, action = "buy", symbol: propSymbol }) {
  const [symbol, setSymbol] = useState(propSymbol || "");
  const [quantity, setQuantity] = useState(0);
  const [stockPrice, setStockPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [tradingPin, setTradingPin] = useState("");

  useEffect(() => {
    if (!symbol || propSymbol) {
      setStockPrice(null);
      return;
    }

    const fetchPrice = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`
        );

        setStockPrice(data.c && data.c > 0 ? data.c : "not-found");
      } catch {
        setStockPrice("not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [symbol, propSymbol]);

  const handleVerifyPinAndSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/user/verify-pin`, { pin: tradingPin }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setShowPinModal(false);
      setTradingPin("");
      handleTransaction();
    } catch (err) {
      toast.error("Invalid Trading PIN");
    }
  };

  const handleTransaction = async () => {
    const finalSymbol = (propSymbol || symbol).toUpperCase();
    const transactionData = { symbol: finalSymbol, quantity, action };

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/transaction`, transactionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success(`${action === "buy" ? "Bought" : "Sold"} ${quantity} ${quantity === 1 ? "Stock" : "Stocks"} of ${finalSymbol}`);
      setQuantity(0);
      if (!propSymbol) setSymbol("");
      setStockPrice(null);

      onSubmit?.({ ...data, symbol: finalSymbol, quantity, action });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Transaction failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!symbol || quantity <= 0) {
      toast.error("Enter valid symbol and quantity.");
      return;
    }

    setShowPinModal(true); // Show PIN modal before proceeding
  };

  return (
    <div className="flex justify-center items-start min-h-[75vh] mt-6 bg-gradient-to-br from-[#0f172a] via-[#1a2e3b] to-[#0d1b2a] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-700"
      >
        <h2 className="text-2xl font-extrabold text-center text-blue-400 uppercase tracking-widest">
          {action === "buy" ? "Buy Stocks" : "Sell Stocks"}
        </h2>

        <div className="space-y-3">
          {!propSymbol && (
            <input
              type="text"
              placeholder="Enter Stock Symbol (e.g. AAPL)"
              className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          )}

          <input
            type="number"
            placeholder="Enter Quantity"
            className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={1}
          />
        </div>

        {loading && <p className="text-center text-yellow-400 font-medium">Fetching stock price...</p>}
        {!propSymbol && stockPrice !== null && stockPrice !== "not-found" && (
          <p className="text-center text-green-400 font-semibold text-lg">Current Price: ₹{stockPrice}</p>
        )}
        {!propSymbol && stockPrice === "not-found" && (
          <p className="text-center text-red-500 font-semibold text-lg">No stock found for the entered symbol.</p>
        )}

        <button
          type="submit"
          className={`w-full py-4 text-xl font-bold rounded-2xl text-white shadow-lg transition-transform duration-200 transform hover:scale-[1.02] ${
            action === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={loading || quantity <= 0}
        >
          {action === "buy" ? "Buy Now" : "Sell Now"}
        </button>
      </form>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-[#1e293b] text-white p-8 rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <h3 className="text-2xl font-semibold text-center mb-5">Enter Trading PIN</h3>
            <input
              type="password"
              placeholder="Trading PIN"
              className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={tradingPin}
              onChange={(e) => setTradingPin(e.target.value)}
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => {
                  setTradingPin("");
                  setShowPinModal(false);
                }}
                className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPinAndSubmit}
                className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                Verify & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
