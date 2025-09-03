import { useMemo, useState } from "react";

type Currency = "USD" | "EUR" | "USDT" | "VES";

const CURRENCIES: { code: Currency; name: string }[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "USDT", name: "Tether (USDT)" },
  { code: "VES", name: "Bolívar (VES)" },
];
// harcoded rate for the moment
// Ej.: GET /api/rates/latest -> { USD:1, EUR:0.92, USDT:1, VES:36.5 }
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white p-6">
            <h1 className="text-2xl font-semibold">Currency Converter</h1>
            <p className="text-white/90 text-sm">
              Conversión rápida entre monedas. (Tasas demo)
            </p>
          </div>

          <div className="p-6 grid gap-5">
            {/* Amount */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Amount</span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </label>

            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
              <label className="sm:col-span-2 block">
                <span className="text-sm font-medium text-gray-700">From</span>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as Currency)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} · {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={swap}
                  className="mt-6 h-10 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition"
                  aria-label="Swap currencies"
                  title="Swap"
                >
                  ⇄
                </button>
              </div>

              <label className="sm:col-span-2 block">
                <span className="text-sm font-medium text-gray-700">To</span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as Currency)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} · {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Result */}
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div className="text-sm text-gray-600">Resultado</div>
              <div className="mt-1 text-2xl font-semibold">
                {fmt(Number(amount || "0"), from)} → {fmt(result, to)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Tasa usada: 1 {from} = {(RATES[to] / RATES[from]).toFixed(6)}{" "}
                {to}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
