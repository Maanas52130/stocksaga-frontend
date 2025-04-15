import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

export default function StockSearch() {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a stock symbol or name');
      return;
    }

    setLoading(true);
    setStocks([]);

    try {
      const response = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`);
      const data = await response.json();

      if (response.ok) {
        if (data.result.length === 0) {
          toast.info('No stocks found for this query');
        } else {
          setStocks(data.result);
        }
      } else {
        toast.error(`Error: ${data.error || 'An unexpected error occurred'}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stock by name or symbol..."
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {stocks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {stocks.map(({ symbol, description }) => (
              <li key={symbol}>
                <Link
                  to={`/stock/${symbol}`}
                  className="flex justify-between items-center px-4 py-2 bg-white border rounded-lg text-sm hover:shadow-md hover:bg-green-50 transition"
                >
                  <span className="text-gray-800">{description}</span>
                  <span className="text-gray-500 font-medium">{symbol}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
