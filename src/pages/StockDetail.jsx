import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

export default function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const [quoteRes, profileRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
        ]);

        const quote = await quoteRes.json();
        const profile = await profileRes.json();

        if (!quoteRes.ok || !profileRes.ok || quote.c === 0) {
          throw new Error('No stock data available for this symbol');
        }

        setStockData({ quote, profile });
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(`Failed to load stock details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol]);

  if (loading) {
    return <div className="text-center py-10 text-white text-2xl font-semibold animate-pulse">Loading stock details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10 text-2xl font-semibold">Error: {error}</div>;
  }

  const { quote, profile } = stockData;
  const isUp = quote.c >= quote.pc;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e121a] via-[#1a1f2e] to-[#10151f] px-6 py-10 text-white font-[Inter,sans-serif]">
      <div className="max-w-5xl mx-auto bg-[#f8fafc] p-8 rounded-3xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-800 tracking-tight">
          {profile.name || symbol} <span className="text-gray-600 text-2xl font-medium">({symbol})</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center mb-10">
          <StockCard title="Current Price" value={`₹${quote.c}`} isPositive={isUp} />
          <StockCard title="High (24h)" value={`₹${quote.h}`} isPositive />
          <StockCard title="Low (24h)" value={`₹${quote.l}`} isPositive={false} />
          <StockCard title="Open (Today)" value={`₹${quote.o}`} isNeutral />
          <StockCard title="Previous Close" value={`₹${quote.pc}`} isNeutral />
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-3xl font-bold text-green-700 border-b border-green-500 mb-4 pb-2">📊 Company Overview</h2>

          <p className="text-lg mb-2">
            <span className="font-semibold text-black">Industry:</span>{' '}
            <span className="text-black">{profile.finnhubIndustry || 'N/A'}</span>
          </p>

          {profile.weburl && (
            <p className="text-lg mb-2">
              <span className="font-semibold text-black">Website:</span>{' '}
              <a
                href={profile.weburl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {profile.weburl}
              </a>
            </p>
          )}

          {profile.description && (
            <p className="text-black mt-4 leading-relaxed text-base">{profile.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StockCard({ title, value, isPositive, isNeutral }) {
  let bgClass = 'bg-gradient-to-br from-gray-800 to-gray-900';
  let textClass = 'text-gray-200';
  let Icon = null;

  if (!isNeutral) {
    if (isPositive) {
      bgClass = 'bg-gradient-to-br from-green-700 to-green-900';
      textClass = 'text-green-300';
      Icon = <ArrowUpRight className="inline-block ml-1 text-green-400" size={20} />;
    } else {
      bgClass = 'bg-gradient-to-br from-red-700 to-red-900';
      textClass = 'text-red-300';
      Icon = <ArrowDownRight className="inline-block ml-1 text-red-400" size={20} />;
    }
  }

  return (
    <div
      className={`${bgClass} rounded-xl p-6 border border-gray-700 shadow-md transition-transform transform hover:scale-105 duration-200 ease-in-out`}
    >
      <p className="text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${textClass}`}>
        {value} {Icon}
      </p>
    </div>
  );
}
