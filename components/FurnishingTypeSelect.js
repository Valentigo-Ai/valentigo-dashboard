import { useState, useEffect } from "react";

export default function FurnishingTypeSelect({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);

  const furnishingTypes = [
    "Furnished",
    "Part Furnished",
    "Unfurnished",
    "Custom"
  ];

  // Automatically show custom field if value is not a predefined option
  useEffect(() => {
    if (value && !furnishingTypes.includes(value)) {
      setShowCustom(true);
    }
  }, [value]);

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
      <select
        className="w-full p-2 rounded border"
        value={showCustom ? "Custom" : value}
        onChange={handleSelect}
      >
        <option value="">Select Furnishing</option>
        {furnishingTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {showCustom && (
        <input
          type="text"
          className="w-full p-2 rounded border"
          placeholder="Enter custom furnishing type"
          value={value}           // ← FIXED — always reflects the actual custom value
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
