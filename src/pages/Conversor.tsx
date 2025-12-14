import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import type { Currency } from "../models/Currency";
import api, { isAxiosError } from "../lib/api";

export default function Conversor() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USDT");
  const [to, setTo] = useState<string>("VES");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [currenciesRes, binanceRes] = await Promise.all([
          api.get("/currencies"),
          api.get("/binance/average"),
        ]);

        // A. Procesamos las monedas
        const currenciesData = currenciesRes.data.data || [];
        const rawCurrencies = Array.isArray(currenciesData)
          ? currenciesData
          : [];

        // B. Procesamos la tasa del scrapper
        // binanceRes.data
        const vesRate = binanceRes.data.data?.average || 0;

        console.log("Monedas base:", rawCurrencies);
        console.log("Tasa Binance (VES):", vesRate);

        // C.Asignamos las tasas
        const finalCurrencies = rawCurrencies.map((currency: Currency) => {
          let rate = 1;

          if (currency.code === "USDT") {
            rate = 1; // USDT siempre es la base 1
          } else if (currency.code === "VES") {
            rate = Number(vesRate) > 0 ? Number(vesRate) : 1;
          }

          return { ...currency, rate };
        });

        setCurrencies(finalCurrencies);
      } catch (error) {
        console.error("Error cargando datos:", error);
        // Fallback: Si falla el scraper
        setCurrencies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const result = useMemo(() => {
    const a = Number(amount);

    if (!Number.isFinite(a) || !currencies || currencies.length === 0) return 0;

    const fromCurrency = currencies.find((c) => c.code === from);
    const toCurrency = currencies.find((c) => c.code === to);

    if (!fromCurrency || !toCurrency) return 0;

    const rate = toCurrency.rate / fromCurrency.rate;
    return a * rate;
  }, [amount, from, to, currencies]);

  const handleConvert = async () => {
    if (!["USDT", "VES"].includes(from) || !["USDT", "VES"].includes(to)) {
      alert("Por el momento solo soportamos conversiones entre USDT y VES.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/conversions", {
        fromCurrency: from,
        toCurrency: to,
        amount: Number(amount),
      });

      alert("¡Conversión exitosa!");
    } catch (error) {
      console.error("Error en la transacción", error);
      let mensaje = "Error de conexión con el servidor";
      if (isAxiosError(error) && error.response) {
        mensaje = error.response.data.message || mensaje;
      }
      alert(`Error: ${mensaje}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers
  const fmt = (v: number, code: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code === "USDT" ? "USD" : code,
    }).format(v);

  const getRate = (code: string) =>
    currencies?.find((c) => c.code === code)?.rate || 1;

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
                {/* Input Amount */}
                <label className="block">
                  <span className="text-sm font-medium text-gray-800">
                    Monto a convertir
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2"
                  />
                </label>

                {/* Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-medium text-gray-800">
                      De
                    </span>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 bg-white"
                    >
                      {currencies?.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      onClick={swap}
                      className="mt-6 h-11 px-5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100"
                    >
                      ⇄
                    </button>
                  </div>

                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-medium text-gray-800">A</span>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 bg-white"
                    >
                      {currencies?.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Result Preview */}
                <div className="rounded-xl border border-amber-200 p-4 bg-amber-50/60">
                  <div className="text-sm text-amber-800">Estimado</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">
                    {/* Fix a NaN si carga lento */}
                    {loading
                      ? "Calculando..."
                      : `${fmt(Number(amount || "0"), from)} → ${fmt(result, to)}`}
                  </div>
                  <div className="mt-2 text-sm text-amber-700">
                    {/* Validación para division con 0 */}
                    {!loading && currencies.length > 0
                      ? `Tasa: 1 ${from} = ${(getRate(to) / getRate(from)).toFixed(2)} ${to}`
                      : "Cargando tasas..."}
                  </div>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={handleConvert}
                  disabled={isSubmitting || loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Procesando..." : "Realizar Conversión"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
