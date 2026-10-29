import { useState } from "react";
import Field from "./components/Field.jsx";
import GrowthBars from "./components/GrowthBars.jsx";
import { CURRENCIES, formatMoney, formatCoins, formatPercent, toNumber, getCurrency } from "./utils/format.js";

const UNITS = [
  { value: "days", label: "Days", short: "d", perYear: 365 },
  { value: "months", label: "Months", short: "mo", perYear: 12 },
  { value: "years", label: "Years", short: "yr", perYear: 1 },
];

const STEPS = 6;

export default function App() {
  const [currency, setCurrency] = useState("INR");
  const [coins, setCoins] = useState("");
  const [rate, setRate] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("months");
  const [fee, setFee] = useState("");
  const [price, setPrice] = useState("");

  const { symbol } = getCurrency(currency);

  const reset = () => {
    setCoins("");
    setRate("");
    setDuration("");
    setUnit("months");
    setFee("");
    setPrice("");
  };

  const c = toNumber(coins);
  const r = toNumber(rate);
  const d = toNumber(duration);
  const f = fee === "" ? 0 : toNumber(fee); // fee is optional: empty = 0
  const p = price === "" ? null : toNumber(price); // price is optional

  // ---------- validation ----------
  let error = "";
  if (!Number.isNaN(c) && c <= 0) error = "Coins held must be more than 0.";
  else if (!Number.isNaN(r) && r < 0) error = "Reward rate cannot be negative.";
  else if (!Number.isNaN(d) && d <= 0) error = "Duration must be more than 0.";
  else if (Number.isNaN(f) || f < 0 || f > 100) error = "Fee must be between 0% and 100%.";
  else if (p !== null && (Number.isNaN(p) || p <= 0)) error = "Coin price must be more than 0, or leave it empty.";

  const ready = !error && !Number.isNaN(c) && !Number.isNaN(r) && !Number.isNaN(d);

  // ---------- calculation (simple rewards, no compounding) ----------
  let result = null;
  if (ready) {
    const u = UNITS.find((x) => x.value === unit);
    const rewardsFor = (periods) => {
      const years = periods / u.perYear;
      const gross = c * (r / 100) * years;
      return { gross, fee: gross * (f / 100), net: gross * (1 - f / 100) };
    };
    const total = rewardsFor(d);
    const steps = Array.from({ length: STEPS }, (_, i) => {
      const at = (d * (i + 1)) / STEPS;
      return { label: `${Number(at.toFixed(1))} ${u.short}`, value: rewardsFor(at).net };
    });
    result = { ...total, steps };
  }

  const unitWord = unit === "days" ? "day" : unit === "months" ? "month" : "year";
  const durationLabel = `${d} ${d === 1 ? unitWord : unit}`;

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <div>
            <h1>Rewards earnings</h1>
            <p>Estimate what your coins could earn over time, after fees.</p>
          </div>
          <div className="currency">
            <label htmlFor="currency">Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.symbol} {cur.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="content">
        {/* ---------- inputs ---------- */}
        <section className="card form" aria-label="Your inputs">
          <Field id="coins" label="Coins you hold" placeholder="e.g. 10" value={coins} onChange={(e) => setCoins(e.target.value)} />
          <Field id="rate" label="Assumed reward rate per year" suffix="%" placeholder="e.g. 5" value={rate} onChange={(e) => setRate(e.target.value)} />

          <div className="field">
            <label htmlFor="duration">Duration</label>
            <div className="row-2">
              <div className="input-wrap">
                <input id="duration" type="number" inputMode="decimal" min="0" step="any" placeholder="e.g. 12" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <select aria-label="Duration unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Field id="fee" label="Fee on rewards (optional)" suffix="%" placeholder="e.g. 10" hint="The share of your rewards the platform keeps." value={fee} onChange={(e) => setFee(e.target.value)} />
          <Field id="price" label="Price of one coin (optional)" prefix={symbol} placeholder="Add to see rewards in money" value={price} onChange={(e) => setPrice(e.target.value)} />

          {error && <p className="error" role="alert">{error}</p>}

          <button type="button" className="reset" onClick={reset}>
            Reset
          </button>
        </section>

        {/* ---------- result ---------- */}
        <section className="card result" aria-live="polite" aria-label="Result">
          {result ? (
            <>
              <div className="keep">
                <p className="keep-label">Rewards you keep after {durationLabel}</p>
                <p className="keep-value">{formatCoins(result.net)} <span>coins</span></p>
                {p !== null && <p className="keep-money">about {formatMoney(result.net * p, currency)} at {formatMoney(p, currency)} per coin</p>}
              </div>

              <h2>How it builds up</h2>
              <GrowthBars steps={result.steps} />

              <dl className="breakdown">
                <div><dt>Rewards before fee</dt><dd>{formatCoins(result.gross)} coins</dd></div>
                <div><dt>Fee ({formatPercent(f)})</dt><dd>− {formatCoins(result.fee)} coins</dd></div>
                <div><dt>Coins after rewards</dt><dd>{formatCoins(c + result.net)} coins</dd></div>
              </dl>
              <p className="note">Simple rewards, without compounding.</p>
            </>
          ) : (
            <div className="empty">
              <p className="empty-title">Your estimate shows up here</p>
              <p>Enter your coins, a yearly reward rate and a duration to see what you could earn.</p>
            </div>
          )}

          <p className="change-warning">
            <strong>Keep in mind:</strong> reward rates and coin prices can change at any time, so real rewards may be higher or lower than this estimate.
          </p>
        </section>
      </main>

      <footer>For learning and estimates only. This is not financial advice.</footer>
    </div>
  );
}
