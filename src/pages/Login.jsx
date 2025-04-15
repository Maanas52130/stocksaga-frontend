import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("🟢 Login successful!");
        localStorage.setItem("authToken", data.token);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast.error(`🔴 ${data.message || "Login failed"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("🔴 Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2f7] via-[#e0e7ff] to-[#f1f5f9] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🚀 Welcome to StockSaga
        </h1>
        <LoginForm onLogin={handleLogin} />
        <p className="mt-4 text-sm text-gray-500 text-center">
          Trade smart. Trade secure. 📈
        </p>
      </div>
    </div>
  );
}
