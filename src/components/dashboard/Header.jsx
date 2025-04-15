import React from "react";

export default function Header() {
  const username = localStorage.getItem("username");
  const user = username ? username : "Trader";

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-500 to-indigo-600 dark:from-blue-400 dark:via-green-400 dark:to-indigo-400 drop-shadow-sm">
        Dashboard
      </h1>
      <p className="text-lg mt-1 text-gray-600 dark:text-gray-300">
        Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user}</span>. Here's your market overview 📊
      </p>
    </div>
  );
}
