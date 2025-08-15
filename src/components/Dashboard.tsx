
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

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

interface User {
  name: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [sendResults, setSendResults] = useState<
    { currency: string; received: number; fee: number; rate: number }[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [amountError, setAmountError] = useState<string>("");
  const transactionsPerPage = 5;

  // Min/Max amounts for validation
  const MIN_AMOUNT = 10;
  const MAX_AMOUNT = 10000;

  // Ads data
  const ads: Ad[] = [
    { 
      id: 1, 
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=150&fit=crop", 
      title: "Premium Banking Services", 
      description: "Secure international transfers with competitive rates." 
    },
    { 
      id: 2, 
      imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=150&fit=crop", 
      title: "Student Discounts", 
      description: "Special rates for educational expenses abroad." 
    },
    { 
      id: 3, 
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=150&fit=crop", 
      title: "Mobile Banking App", 
      description: "Send money on-the-go with our mobile app." 
    },
  ];
  const [currentAd, setCurrentAd] = useState(0);

  // Auto-scroll ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live rates from backend
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rates`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Process the rates data structure
        const processedRates: Rate[] = [];
        if (Array.isArray(data)) {
          data.forEach(item => {
            Object.keys(item).forEach(currency => {
              if (["GBP", "ZAR", "USD"].includes(currency)) {
                processedRates.push({ currency, rate: item[currency] });
              }
            });
          });
        } else if (typeof data === 'object') {
          Object.keys(data).forEach(currency => {
            if (["GBP", "ZAR", "USD"].includes(currency)) {
              processedRates.push({ currency, rate: data[currency] });
            }
          });
        }
        
        setRates(processedRates);
      } catch (err) {
        console.error("Failed to fetch rates:", err);
        // Fallback rates
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

  // Generate mock transactions
  useEffect(() => {
    const mock: Transaction[] = Array.from({ length: 15 }, (_, i) => {
      const currencies = ["GBP", "ZAR"];
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      const amountUSD = Math.floor(Math.random() * 1000) + 50;
      const feePercent = currency === "GBP" ? 0.1 : 0.2;
      const fee = Math.ceil(amountUSD * feePercent);
      const rate = currency === "GBP" ? 0.84 : 17.69;
      const received = Math.ceil((amountUSD - fee) * rate);
      
      return {
        id: i + 1,
        amountUSD,
        currency,
        received,
        fee,
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      };
    });
    setTransactions(mock);
  }, []);

  // Calculate send money results
  useEffect(() => {
    if (usdAmount <= 0) {
      setSendResults([]);
      return;
    }

    const results = rates
      .filter(r => ["GBP", "ZAR"].includes(r.currency))
      .map(r => {
        const feePercent = r.currency === "GBP" ? 0.1 : 0.2;
        const fee = Math.ceil(usdAmount * feePercent);
        const received = Math.ceil((usdAmount - fee) * r.rate);
        return { currency: r.currency, fee, received, rate: r.rate };
      });
    setSendResults(results);
  }, [usdAmount, rates]);

  // Validate amount input
  const handleAmountChange = (value: number) => {
    setUsdAmount(value);
    
    if (value < 0) {
      setAmountError("Amount cannot be negative");
    } else if (value > 0 && value < MIN_AMOUNT) {
      setAmountError(`Minimum amount is $${MIN_AMOUNT}`);
    } else if (value > MAX_AMOUNT) {
      setAmountError(`Maximum amount is $${MAX_AMOUNT}`);
    } else {
      setAmountError("");
    }
  };

  // Pagination
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  if (loadingRates) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-white text-xl">Loading exchange rates...</span>
      </div>
    );
  }

  const flagColors: Record<string, string> = {
    USD: "bg-gradient-to-r from-blue-500 to-blue-600",
    GBP: "bg-gradient-to-r from-red-500 to-red-600",
    ZAR: "bg-gradient-to-r from-green-500 to-green-600",
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-blue-200">Send money to your loved ones abroad</p>
          </div>
          <button
            onClick={onLogout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Send Money Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">💸 Send Money</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Amount in USD (${MIN_AMOUNT} - ${MAX_AMOUNT})
              </label>
              <input
                type="number"
                min={0}
                max={MAX_AMOUNT}
                value={usdAmount || ""}
                onChange={e => handleAmountChange(Number(e.target.value))}
                placeholder={`Enter amount ($${MIN_AMOUNT} - $${MAX_AMOUNT})`}
                className="w-full p-4 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium"
              />
              {amountError && (
                <p className="text-red-300 text-sm mt-1">{amountError}</p>
              )}
            </div>
            
            {sendResults.length > 0 && !amountError && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {sendResults.map(res => (
                  <motion.div
                    key={res.currency}
                    className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${flagColors[res.currency]} text-white`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl">{res.currency}</h3>
                      <span className="text-2xl">
                        {res.currency === "GBP" ? "🇬🇧" : "🇿🇦"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white text-opacity-90">
                        Exchange Rate: {res.rate.toFixed(4)}
                      </p>
                      <p className="text-white text-opacity-90">
                        Fee ({res.currency === "GBP" ? "10" : "20"}%): ${res.fee}
                      </p>
                      <motion.div
                        key={res.received}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5 }}
                        className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg"
                      >
                        <p className="text-sm text-white text-opacity-80">Recipient receives:</p>
                        <p className="text-2xl font-extrabold">
                          {res.received.toLocaleString()} {res.currency}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Ads Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">📢 Special Offers</h2>
          <div className="relative overflow-hidden rounded-xl">
            <motion.div
              key={currentAd}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white"
            >
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={ads[currentAd].imageUrl}
                  alt={ads[currentAd].title}
                  className="w-full md:w-32 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">{ads[currentAd].title}</h3>
                  <p className="text-white text-opacity-90">{ads[currentAd].description}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center mt-4 space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAd(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentAd ? "bg-white" : "bg-white bg-opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">📊 Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Amount USD</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Currency</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Received</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Fee</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors ${
                      tx.id % 2 === 0 ? "bg-white bg-opacity-5" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-white">{tx.id}</td>
                    <td className="py-3 px-4 text-white">${tx.amountUSD}</td>
                    <td className="py-3 px-4 text-white">
                      <span className="inline-flex items-center">
                        {tx.currency}
                        <span className="ml-1">
                          {tx.currency === "GBP" ? "🇬🇧" : "🇿🇦"}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {tx.received.toLocaleString()} {tx.currency}
                    </td>
                    <td className="py-3 px-4 text-white">${tx.fee}</td>
                    <td className="py-3 px-4 text-white">{tx.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 hover:bg-opacity-30 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 hover:bg-opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
