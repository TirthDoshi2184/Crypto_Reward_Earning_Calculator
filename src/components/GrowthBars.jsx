// Six bars showing how the rewards you keep build up over the chosen duration.
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 3 });

export default function GrowthBars({ steps }) {
  const max = steps[steps.length - 1].value || 1;

  return (
    <div className="growth" role="img" aria-label="Bars showing rewards building up over time">
      {steps.map((s, i) => (
        <div className="growth-col" key={i}>
          <span className="growth-value">{compact.format(s.value)}</span>
          <div className="growth-bar" style={{ height: Math.max((s.value / max) * 100, 3) + "%" }} />
          <span className="growth-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
