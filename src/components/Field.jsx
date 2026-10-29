export default function Field({ id, label, hint, prefix, suffix, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {prefix && <span className="unit unit-left">{prefix}</span>}
        <input id={id} type="number" inputMode="decimal" min="0" step="any" {...inputProps} />
        {suffix && <span className="unit unit-right">{suffix}</span>}
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
