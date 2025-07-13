"use client";

import { useState } from "react";
import { ethers, isAddress } from "ethers";
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react";

/* ---------- Kontrak LXP & RPC ---------- */
const LXP = "0xd83af4fbD77f3AB65C3B1Dc4B38D7e67AEcf599A";
const ABI = [
  "function balanceOf(address) view returns(uint256)",
  "function decimals() view returns(uint8)",
];
const provider = new ethers.JsonRpcProvider("https://rpc.linea.build");
const lxp = new ethers.Contract(LXP, ABI, provider);

/* ---------- Data Tier (wallet & total LXP) ---------- */
const raw = [
  { label: "T1", min: 1500, max: 1999, wallets: 290_986, lxp: 253_975_654 },
  { label: "T2", min: 2000, max: 2999, wallets: 160_904, lxp: 386_710_595 },
  { label: "T3", min: 3000, max: 3999, wallets: 94_746, lxp: 329_173_345 },
  { label: "T4", min: 4000, max: 4999, wallets: 64_560, lxp: 287_092_673 },
  { label: "T5", min: 5000, max: 6499, wallets: 29_305, lxp: 159_119_748 },
  { label: "T6", min: 6500, max: 8499, wallets: 13_100, lxp: 84_306_299 },
  { label: "T7", min: 8500, max: 9999, wallets: 5_396, lxp: 40_500_487 },
  { label: "T8", min: 10000, max: Infinity, wallets: 77, lxp: 823_467 },
];
const TOTAL_LXP = raw.reduce((s, t) => s + t.lxp, 0); // 1 578 063 984
const POOL = 1_500_000_000;

/* hitung pool & alokasi per-wallet */
const tiers = raw.map((t) => {
  const pool = (t.lxp / TOTAL_LXP) * POOL;
  const perWallet = Math.floor(pool / t.wallets);
  return { ...t, perWallet };
});
const getTier = (lxpVal: number) =>
  tiers.find((t) => lxpVal >= t.min && lxpVal <= t.max);

/* ---------- Types ---------- */
interface Result {
  eligible: boolean;
  tier?: string;
  allocation?: number;
  balance?: number;
}

/* ---------- Komponen ---------- */
export default function CheckerForm() {
  const [addr, setAddr] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!isAddress(addr)) {
      setError("Invalid address");
      setResult(null);
      return;
    }
    setError("");
    setLoading(true);
    const key = `airdrop_${addr.toLowerCase()}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      setResult(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      const [rawBal, dec] = await Promise.all([
        lxp.balanceOf(addr),
        lxp.decimals(),
      ]);
      const balance = Number(ethers.formatUnits(rawBal, dec));
      if (balance < 1500) {
        const res: Result = { eligible: false, balance };
        localStorage.setItem(key, JSON.stringify(res));
        setResult(res);
      } else {
        const tier = getTier(balance);
        const res: Result = {
          eligible: true,
          tier: tier?.label,
          allocation: tier?.perWallet,
          balance,
        };
        localStorage.setItem(key, JSON.stringify(res));
        setResult(res);
      }
    } catch (e) {
      console.error(e);
      setError("RPC error – try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-12 px-4">
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="0x…"
        className="w-full p-4 rounded-xl border border-zinc-300 dark:border-zinc-600
                   bg-white dark:bg-zinc-900 text-lineaPurple dark:text-white
                   focus:ring-2 focus:ring-lineaPurple/50 shadow-sm transition"
        disabled={loading || !!result}
      />

      <button
        onClick={check}
        disabled={loading || !!result}
        className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-br from-lineaPurple to-indigo-700
                   text-white font-medium flex items-center gap-2
                   hover:opacity-90 disabled:opacity-40 transition"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {result ? "Checked" : "Check Allocation"}
      </button>

      {error && (
        <p className="mt-6 flex items-center gap-2 text-red-600">
          <AlertTriangle size={18} /> {error}
        </p>
      )}

      {result && (
        <div
          className="mt-8 w-full bg-gradient-to-br from-emerald-100/60 to-white
                        dark:from-zinc-800/60 p-6 rounded-xl shadow-lg border
                        dark:border-zinc-700 animate-[fade-in_0.5s_ease-out,scale-in_0.5s]"
        >
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-lg font-semibold">
            <CheckCircle size={22} /> Allocation Result
          </div>

          <p className="mt-3">
            LXP Balance: <strong>{result.balance?.toLocaleString()}</strong>
          </p>

          {!result.eligible && (
            <p className="mt-3 text-red-500 font-medium">
              ❌ Not eligible (need ≥ 1 500 LXP)
            </p>
          )}

          {result.eligible && (
            <>
              <p className="mt-2">
                Tier: <strong>{result.tier}</strong>
              </p>
              <p className="mt-1 text-xl">
                Allocation:&nbsp;
                <strong className="text-green-600 dark:text-green-400">
                  {result.allocation?.toLocaleString()} $LINEA
                </strong>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
