import React from "react";

export default function Disclaimer() {
  return (
    <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900 dark:to-red-800 border-l-4 border-red-600 text-red-800 dark:text-red-200 p-5 rounded-xl shadow-md text-sm md:text-base font-medium leading-relaxed">
      <strong className="block mb-1 text-red-700 dark:text-red-300 text-base md:text-lg">
        ⚠️ Disclaimer:
      </strong>
      This is a virtual stock trading platform intended for educational and demonstration purposes only. No real money or real investments are involved.
    </div>
  );
}
