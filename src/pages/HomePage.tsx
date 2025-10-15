import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type Currency = "USD" | "EUR" | "USDT" | "VES";

const CURRENCIES: { code: Currency; name: string }[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "USDT", name: "Tether (USDT)" },
  { code: "VES", name: "Bolívar (VES)" },
];

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  USDT: 1,
  VES: 36.5,
};

export default function Home() {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<Currency>("USD");
  const [to, setTo] = useState<Currency>("EUR");

  const result = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a)) return 0;
    const rate = RATES[to] / RATES[from];
    return a * rate;
  }, [amount, from, to]);

  const fmt = (v: number, c: Currency) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c === "USDT" ? "USD" : c,
      maximumFractionDigits: 6,
    }).format(v);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />
      <main>
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="p-[2px] rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 shadow-2xl shadow-amber-500/20">
            <div
              className="rounded-3xl bg-white ring-1 ring-amber-200"
              style={{ colorScheme: "light" }}
            >
              <div className="p-8 grid gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-gray-800">
                    Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
                    placeholder="0.00"
                  />
                </label>

                {/* From / To */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-medium text-gray-800">
                      From
                    </span>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value as Currency)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 appearance-none"
                    >
                      {CURRENCIES.map((c) => (
                        <option
                          key={c.code}
                          value={c.code}
                          className="text-gray-900"
                        >
                          {c.code} · {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={swap}
                      className="mt-6 h-11 px-5 rounded-xl border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] transition shadow-sm"
                      aria-label="Swap currencies"
                      title="Swap"
                    >
                      ⇄
                    </button>
                  </div>

                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-medium text-gray-800">
                      To
                    </span>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value as Currency)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 appearance-none"
                    >
                      {CURRENCIES.map((c) => (
                        <option
                          key={c.code}
                          value={c.code}
                          className="text-gray-900"
                        >
                          {c.code} · {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Result */}
                <div className="rounded-xl border border-amber-200 p-4 bg-amber-50/60">
                  <div className="text-sm text-amber-800">Resultado</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">
                    {fmt(Number(amount || "0"), from)} → {fmt(result, to)}
                  </div>
                  <div className="mt-2 text-sm text-amber-700">
                    Tasa usada: 1 {from} ={" "}
                    {(RATES[to] / RATES[from]).toFixed(6)} {to}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
