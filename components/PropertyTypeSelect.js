import { useState, useEffect } from "react";

export default function PropertyTypeSelect({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false);

  // FULL restored & expanded property type list
  const propertyTypes = [
    "House",
    "Semi-detached House",
    "Detached House",
    "Terraced House",
    "End of Terrace House",
    "Apartment / Flat",
    "Bungalow",
    "Cottage",
    "Penthouse",
    "Studio",
    "Villa",
    "Duplex",
    "Townhouse",
    "Farmhouse",
    "Land / Plot",
    "Commercial Property",
    "Mixed Use Property",
    "Other (Custom)"
  ];

  // Ensure that if 'value' is not one of the predefined types,
  // the component automatically switches to custom mode.
  useEffect(() => {
    if (value && !propertyTypes.includes(value)) {
      setShowCustom(true);
    }
  }, [value]);

  const handleSelect = (e) => {
    const selected = e.target.value;

    if (selected === "Other (Custom)") {
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
        value={showCustom ? "Other (Custom)" : value}
        onChange={handleSelect}
      >
        <option value="">Select Property Type</option>
        {propertyTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {showCustom && (
        <input
          type="text"
          className="w-full p-2 rounded border"
          placeholder="Enter custom property type"
          value={showCustom && !propertyTypes.includes(value) ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
