import { useState } from "react";

export default function SignupForm({ onSignup }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    onSignup(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign Up to StockSaga</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={handleChange}
        required
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={handleChange}
        required
      />

      <input
        name="pin"
        type="password"
        maxLength={4}
        placeholder="4-digit Trading PIN"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Create Account
      </button>
    </form>
  );
}
