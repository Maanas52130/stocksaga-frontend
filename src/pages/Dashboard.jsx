import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import Sidebar from "../components/dashboard/Sidebar";
import Portfolio from "../components/dashboard/Portfolio";
import Disclaimer from "../components/dashboard/Disclaimer";
import BuySellForm from "../components/dashboard/BuySellForm";
import StockSearch from "../components/dashboard/StockSearch";
import TransactionHistory from "../components/dashboard/TransactionHistory";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [cashBalance, setCashBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [activeSection, setActiveSection] = useState("welcome");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    axios
      .get(`${API_BASE_URL}/api/user/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (isMounted) {
          setCashBalance(res.data.balance || 0);
          setPortfolio(res.data.portfolio || []);
          const username = localStorage.getItem("username");
          if (username) {
            toast.success(`Welcome ${username}! Your current balance is ₹${res.data.balance}`, {
              autoClose: 2000,
            });
          }
        }
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unknown error";
        console.error("💥 Error fetching portfolio data:", errorMsg);
        toast.error(`Failed to fetch portfolio: ${errorMsg}`);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    toast.info("👋 Logged out successfully", {
      autoClose: 1500,
      onClose: () => navigate("/login"),
    });
  };

  const handleBuySellSubmit = (data) => {
    try {
      if (data.updatedBalance !== undefined) setCashBalance(data.updatedBalance);
      if (data.updatedPortfolio !== undefined) setPortfolio(data.updatedPortfolio);
    } catch (error) {
      console.error("Error updating portfolio in Dashboard:", error);
      toast.error("Something went wrong while updating portfolio.");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "welcome":
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome back, Trader! 👋
            </h2>
            <p className="text-gray-600 text-lg">Your current balance is ₹{cashBalance}</p>
          </div>
        );
      case "portfolio":
        return <Portfolio cashBalance={cashBalance} portfolio={portfolio} />;
      case "buySell":
        return <BuySellForm onSubmit={handleBuySellSubmit} action="buy" />;
      case "sellStocks":
        return <BuySellForm onSubmit={handleBuySellSubmit} action="sell" />;
      case "transactions":
        return <TransactionHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300">
      <Sidebar onLogout={handleLogout} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <StockSearch />
        </div>

        {renderSection()}

        {activeSection !== "welcome" && <Disclaimer />}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
