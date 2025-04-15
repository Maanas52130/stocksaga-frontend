import React from "react";
import {
  LogOut,
  BarChart2,
  ShoppingCart,
  DollarSign,
  Clock,
  Home,
} from "lucide-react";

export default function Sidebar({ onLogout, setActiveSection }) {
  const menuItems = [
    { label: "Welcome", icon: <Home size={18} />, key: "welcome" },
    { label: "Portfolio", icon: <BarChart2 size={18} />, key: "portfolio" },
    { label: "Buy Stocks", icon: <ShoppingCart size={18} />, key: "buySell" },
    { label: "Sell Stocks", icon: <DollarSign size={18} />, key: "sellStocks" },
    { label: "Transaction History", icon: <Clock size={18} />, key: "transactions" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6 shadow-xl flex flex-col">
      <div className="flex-grow">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-8 tracking-widest">
          StockSaga
        </h2>

        <ul className="space-y-4">
          {menuItems.map(({ label, key, icon }) => (
            <li key={key}>
              <button
                onClick={() => setActiveSection(key)}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 mb-4"> {/* 🔼 Push it slightly up */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-red-600 text-red-400 hover:text-white transition-colors font-semibold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
