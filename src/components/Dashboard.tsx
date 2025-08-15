import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

interface User {
  name: string;
  email: string;
}

interface Rate {
  currency: string;
  rate: number;
}

interface Transaction {
  id: number;
  amountUSD: number;
  currency: string;
  received: number;
  fee: number;
  date: string;
}

interface Ad {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const CURRENCIES: Record<string, { flag: string; feePercent: number }> = {
  GBP: { flag: "🇬🇧", feePercent: 0.1 },
  ZAR: { flag: "🇿🇦", feePercent: 0.2 },
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [sendResults, setSendResults] = useState<
    { currency: string; received: number; fee: number; rate: number }[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [amountError, setAmountError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const MIN_AMOUNT = 10;
  const MAX_AMOUNT = 10000;
  const transactionsPerPage = 5;

  const ads: Ad[] = [
    {
      id: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=150&fit=crop",
      title: "Premium Banking",
      description: "Secure international transfers with low fees.",
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=150&fit=crop",
      title: "Student Discounts",
      description: "Special rates for education abroad.",
    },
  ];

  const [currentAd, setCurrentAd] = useState(0);

  // Auto-scroll ads
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentAd((prev) => (prev + 1) % ads.length),
      4000
    );
    return () => clearInterval(interval);
  }, [ads.length]);

  // Fetch FX rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rates`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const processedRates: Rate[] = [];

        if (Array.isArray(data)) {
          data.forEach((item) =>
            Object.keys(item).forEach((currency) => {
              if (["USD", "GBP", "ZAR"].includes(currency)) {
                processedRates.push({ currency, rate: item[currency] });
              }
            })
          );
        }

        setRates(processedRates);
      } catch (err) {
        console.error("Failed to fetch rates, using fallback", err);
        setRates([
          { currency: "USD", rate: 1 },
          { currency: "GBP", rate: 0.84 },
          { currency: "ZAR", rate: 17.69 },
        ]);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  // Mock transactions
  useEffect(() => {
    const mock: Transaction[] = Array.from({ length: 15 }, (_, i) => {
      const currency = i % 2 === 0 ? "GBP" : "ZAR";
      const amountUSD = Math.floor(Math.random() * 500 + 50);
      const fee = Math.ceil(amountUSD * CURRENCIES[currency].feePercent);
      const rate = rates.find((r) => r.currency === currency)?.rate || 1;
      const received = Math.ceil((amountUSD - fee) * rate);

      return {
        id: i + 1,
        amountUSD,
        currency,
        fee,
        received,
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      };
    });
    setTransactions(mock);
  }, [rates]);

  // Calculate send results
  useEffect(() => {
    if (usdAmount <= 0) {
      setSendResults([]);
      return;
    }

    const results = rates
      .filter((r) => r.currency in CURRENCIES)
      .map((r) => {
        const fee = Math.ceil(usdAmount * CURRENCIES[r.currency].feePercent);
        const received = Math.ceil((usdAmount - fee) * r.rate);
        return { currency: r.currency, fee, received, rate: r.rate };
      });

    setSendResults(results);
  }, [usdAmount, rates]);

  const handleAmountChange = (value: number) => {
    setUsdAmount(value);
    if (value < 0) setAmountError("Cannot be negative");
    else if (value < MIN_AMOUNT) setAmountError(`Minimum $${MIN_AMOUNT}`);
    else if (value > MAX_AMOUNT) setAmountError(`Maximum $${MAX_AMOUNT}`);
    else setAmountError("");
  };

  if (loadingRates)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <motion.div
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <span className="ml-4 text-xl">Loading rates...</span>
      </div>
    );

  // Pagination
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user.name}!
        </h1>
        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>

      {/* Send Money */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">💸 Send Money</h2>
        <input
          type="number"
          placeholder={`$${MIN_AMOUNT} - $${MAX_AMOUNT}`}
          value={usdAmount || ""}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 mb-2"
        />
        {amountError && <p className="text-red-300">{amountError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {sendResults.map((res) => (
            <motion.div
              key={res.currency}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xl">{res.currency}</span>
                <span className="text-2xl">{CURRENCIES[res.currency].flag}</span>
              </div>
              <p>Rate: {res.rate.toFixed(4)}</p>
              <p>Fee: ${res.fee}</p>
              <p className="font-semibold mt-1">
                Recipient gets: {res.received} {res.currency}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ads Carousel */}
      <div className="bordered">
        <motion.div
          key={currentAd}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-700 p-4 rounded-lg text-white flex items-center"
        >
          <img
            src={ads[currentAd].imageUrl}
            alt={ads[currentAd].title}
            className="w-24 h-16 rounded mr-4 object-cover"
          />
          <div>
            <h3 className="font-bold">{ads[currentAd].title}</h3>
            <p className="text-sm">{ads[currentAd].description}</p>
          </div>
        </motion.div>
        <div className="flex justify-center mt-2 space-x-2">
          {ads.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentAd(idx)}
              className={`w-3 h-3 rounded-full ${
                currentAd === idx ? "bg-white" : "bg-white bg-opacity-40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Past Transactions</h2>
        <div className="centered">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-x-auto p-4">
  <table className="w-full text-white min-w-[700px]">
    <thead>
      <tr className="bg-white bg-opacity-5 backdrop-blur-sm">
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">#</th>
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">Amount USD</th>
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">Currency</th>
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">Received</th>
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">Fee</th>
        <th className="py-3 px-4 text-left text-sm font-semibold tracking-wide border-b border-white border-opacity-20">Date</th>
      </tr>
    </thead>
    <tbody>
      {currentTransactions.map((tx, index) => (
        <motion.tr
          key={tx.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * tx.id }}
          className={`border-b border-white border-opacity-10 
                     odd:bg-white odd:bg-opacity-5 even:bg-transparent
                     hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-opacity-20 
                     transition-colors duration-300`}
        >
          <td className="py-2 px-4">{tx.id}</td>
          <td className="py-2 px-4 font-medium">${tx.amountUSD}</td>
          <td className="py-2 px-4 flex items-center space-x-1">
            <span>{tx.currency}</span>
            <span>{CURRENCIES[tx.currency].flag}</span>
          </td>
          <td className="py-2 px-4 font-semibold text-blue-300">{tx.received} {tx.currency}</td>
          <td className="py-2 px-4">${tx.fee}</td>
          <td className="py-2 px-4">{tx.date}</td>
        </motion.tr>
      ))}
    </tbody>
  </table>  
</div>

        </div>

        {/* Pagination */}
<div className="flex justify-center mt-6 space-x-2">
  {/* Prev Button */}
  <button
    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transform transition-all duration-200"
  >
    Prev
  </button>

  {/* Page Buttons */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 rounded-full font-semibold shadow-lg transform transition-all duration-200
        ${
          currentPage === page
            ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white scale-105"
            : "bg-white bg-opacity-10 text-white hover:bg-opacity-30 hover:scale-105"
        }`}
    >
      {page}
    </button>
  ))}

  {/* Next Button */}
  <button
    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transform transition-all duration-200"
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
}
