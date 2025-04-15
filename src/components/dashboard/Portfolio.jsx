import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Portfolio({ portfolio, cashBalance }) {
  const [enrichedPortfolio, setEnrichedPortfolio] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedPortfolio = await Promise.all(
          portfolio.map(async (stock) => {
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/stocks/price?symbol=${stock.symbol}`
              );
              const currentPrice = res.data?.price ?? null;
              const totalValue =
                currentPrice !== null ? currentPrice * stock.quantity : null;
              const profitLoss =
                currentPrice !== null ? currentPrice - stock.price : null;

              return {
                ...stock,
                currentPrice,
                totalValue,
                profitLoss,
              };
            } catch (error) {
              console.error(`❌ Failed to fetch price for ${stock.symbol}:`, error);
              return {
                ...stock,
                currentPrice: null,
                totalValue: null,
                profitLoss: null,
              };
            }
          })
        );

        setEnrichedPortfolio(updatedPortfolio);
      } catch (err) {
        console.error("⚠️ Error fetching portfolio prices:", err);
      }
    };

    if (portfolio?.length > 0) {
      fetchPrices();
    }
  }, [portfolio]);

  if (!portfolio) return <p>Loading portfolio...</p>;

  return (
    <div className="p-6 bg-gray-100 text-black rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <span role="img" aria-label="chart">
          📈
        </span>
        Portfolio Overview
      </h2>
      <p className="text-green-600 font-semibold mb-6 text-lg">
        <span role="img" aria-label="money">
          💰
        </span>{" "}
        Cash Balance: ₹{cashBalance?.toFixed(2) ?? "0.00"}
      </p>

      {enrichedPortfolio.length === 0 ? (
        <p className="text-gray-600">You don’t own any stocks yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white text-sm text-black border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="p-3 text-left">Symbol</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Avg Buy Price</th>
                  <th className="p-3 text-left">Current Price</th>
                  <th className="p-3 text-left">Total Value</th>
                  <th className="p-3 text-left">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {enrichedPortfolio.map((stock) => {
                  let rowColor = "bg-gray-100";
                  if (stock.profitLoss > 0) rowColor = "bg-green-200";
                  else if (stock.profitLoss < 0) rowColor = "bg-red-200";

                  return (
                    <tr
                      key={stock.symbol}
                      className={`${rowColor} hover:brightness-95 transition-all`}
                    >
                      <td className="p-3 font-semibold">{stock.symbol}</td>
                      <td className="p-3">{stock.quantity}</td>
                      <td className="p-3">₹{stock.price.toFixed(2)}</td>
                      <td className="p-3">
                        ₹
                        {stock.currentPrice !== null
                          ? stock.currentPrice.toFixed(2)
                          : "-"}
                      </td>
                      <td className="p-3">
                        ₹
                        {stock.totalValue !== null
                          ? stock.totalValue.toFixed(2)
                          : "-"}
                      </td>
                      <td className="p-3 font-semibold">
                        ₹
                        {stock.profitLoss !== null
                          ? stock.profitLoss.toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ⚠️ Added this explanation below the table */}
          <p className="text-xs text-gray-500 mt-3 italic">
            Note: All values except "Total Value" are calculated per unit stock.
          </p>
        </>
      )}
    </div>
  );
}
