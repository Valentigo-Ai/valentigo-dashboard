import { useState } from "react";

export default function BathroomSelect({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);

  const options = ["1", "2", "Custom"];

  const handleChange = (e) => {
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
      <select
        className="input w-full"
        value={showCustom ? "Custom" : value}
        onChange={handleChange}
      >
        <option value="">Select Bathrooms</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "Custom" ? "Custom" : `${opt} Bathrooms`}
          </option>
        ))}
      </select>

      {showCustom && (
        <input
          type="number"
          className="input w-full"
          placeholder="Enter number of bathrooms"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
