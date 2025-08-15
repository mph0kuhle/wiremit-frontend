import { useState } from "react";

export default function SendMoney({ rates }: { rates: { [key: string]: number } }) {
  const [amountUSD, setAmountUSD] = useState(0);
  const [currency, setCurrency] = useState("GBP");
  const [finalAmount, setFinalAmount] = useState<number | null>(null);

  const handleConvert = () => {
    if (!rates[currency]) return;
    const feeRate = currency === "GBP" ? 0.1 : 0.2;
    const converted = Math.ceil(amountUSD * rates[currency] * (1 - feeRate));
    setFinalAmount(converted);
  };

  return (
    <div className="p-4 border mb-4">
      <h2 className="text-lg font-bold mb-2">Send Money</h2>
      <input
        type="number"
        placeholder="Amount USD"
        className="border p-2 mr-2"
        value={amountUSD}
        onChange={e => setAmountUSD(Number(e.target.value))}
      />
      <select value={currency} onChange={e => setCurrency(e.target.value)} className="border p-2 mr-2">
        {["GBP","ZAR"].map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={handleConvert} className="bg-blue-500 text-white px-4 py-2">Convert</button>
      {finalAmount !== null && <p className="mt-2">Recipient gets: {finalAmount} {currency}</p>}
    </div>
  );
}
