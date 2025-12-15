import { useState } from "react";

export default function NumberSelect({ label, value, onChange, max = 5 }) {
  const [showCustom, setShowCustom] = useState(false);

  // Generate numbers dynamically based on `max`
  const options = Array.from({ length: max }, (_, i) => `${i + 1}`);
  options.push("Custom");

  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected === "Custom") {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(selected);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>

      <select
        className="w-full p-2 rounded border"
        value={showCustom ? "Custom" : value}
        onChange={handleSelect}
      >
        <option value="">Select {label}</option>
        {options.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      {showCustom && (
        <input
          type="number"
          min="1"
          className="w-full p-2 rounded border"
          placeholder={`Enter custom ${label.toLowerCase()}`}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
