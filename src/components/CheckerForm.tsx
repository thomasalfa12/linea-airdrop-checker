"use client";
import { useState } from "react";
import { isAddress } from "ethers";
import { AlertTriangle } from "lucide-react";

export default function CheckerForm() {
  const [addr, setAddr] = useState("");
  const [allocation, setAllocation] = useState<number | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const handleCheck = () => {
    if (!isAddress(addr)) {
      setError("Invalid address");
      setAllocation(null);
      setIsEligible(null);
      return;
    }

    setError("");
    const eligible = Math.random() > 0.4;
    setIsEligible(eligible);
    setAllocation(
      eligible ? Math.floor(Math.random() * (25000 - 1000 + 1)) + 1000 : null
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-10">
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="0x…"
        className="w-full p-4 rounded border focus:ring-2 focus:ring-lineaPurple/50 
                   bg-white text-lineaPurple dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
      />
      <button
        onClick={handleCheck}
        className="mt-4 px-6 py-3 rounded bg-lineaPurple text-white font-medium 
                   hover:opacity-90 transition dark:bg-white dark:text-lineaPurple"
      >
        Check Allocation
      </button>

      {error && (
        <p className="mt-6 flex items-center gap-2 text-red-600">
          <AlertTriangle size={18} /> {error}
        </p>
      )}

      {isEligible === true && allocation && (
        <p className="mt-6 text-2xl text-green-600 animate-fade-in">
          🎉 This address is <strong>eligible</strong> to claim{" "}
          <strong>{allocation}</strong> $LINEA tokens!
        </p>
      )}

      {isEligible === false && (
        <p className="mt-6 text-xl text-gray-500 animate-fade-in">
          ❌ This address is <strong>not eligible</strong> for the airdrop.
        </p>
      )}
    </div>
  );
}
