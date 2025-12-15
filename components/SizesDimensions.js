import { useState, useEffect } from "react";

/**
 * SizesDimensions
 * Props:
 *  - value (initial)
 *  - onChange(updatedObject)
 *
 * UX:
 *  - Unit toggle (metres / feet)
 *  - Inputs for living/kitchen/dining, dynamic bedroom/bathroom groups
 *  - Auto-calc sqft (approx) shown in form and sent to parent
 */

export default function SizesDimensions({ value = {}, onChange = () => {} }) {
  const [unit, setUnit] = useState(value.unit || "m"); // "m" or "ft"

  // canonical local room data
  const [rooms, setRooms] = useState({
    living: { length: "", width: "" },
    kitchen: { length: "", width: "" },
    dining: { length: "", width: "" },
    bedrooms: value.bedrooms || [{ length: "", width: "" }],
    bathrooms: value.bathrooms || [{ length: "", width: "" }],
    sqft: value.sqft || "",
  });

  useEffect(() => {
    // ensure parent gets initial value
    onChange({ ...rooms, unit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers for conversion
  const convertToMeters = (v) => {
    if (!v && v !== 0) return 0;
    const n = parseFloat(v);
    if (Number.isNaN(n)) return 0;
    return unit === "ft" ? n * 0.3048 : n;
  };

  const convertSqmToSelected = (sqm) => {
    // if user wants feet, convert sqm to sqft (1 sqm = 10.7639 sqft)
    if (unit === "ft") {
      return Math.round(sqm * 10.7639);
    }
    return Math.round(sqm * 10) / 10; // round sqm to 1dp
  };

  const updateRoom = (section, index, field, val) => {
    setRooms((prev) => {
      const updated = { ...prev };

      if (section === "bedrooms" || section === "bathrooms") {
        const arr = [...(updated[section] || [])];
        arr[index] = { ...arr[index], [field]: val };
        updated[section] = arr;
      } else {
        updated[section] = { ...updated[section], [field]: val };
      }

      // recalc sqft
      const computedSqft = calculateTotalArea(updated);
      updated.sqft = computedSqft;

      // push to parent
      onChange({ ...updated, unit });
      return updated;
    });
  };

  const addRoom = (type) => {
    setRooms((prev) => {
      const updated = { ...prev };
      updated[type] = [...(updated[type] || []), { length: "", width: "" }];
      updated.sqft = calculateTotalArea(updated);
      onChange({ ...updated, unit });
      return updated;
    });
  };

  const removeRoom = (type, idx) => {
    setRooms((prev) => {
      const updated = { ...prev };
      const arr = [...(updated[type] || [])];
      arr.splice(idx, 1);
      updated[type] = arr;
      updated.sqft = calculateTotalArea(updated);
      onChange({ ...updated, unit });
      return updated;
    });
  };

  const calculateTotalArea = (data) => {
    // gather every small room object into an array for summing
    const gather = [];

    ["living", "kitchen", "dining"].forEach((k) => {
      if (data[k] && data[k].length) gather.push(data[k]);
    });

    (data.bedrooms || []).forEach((b) => gather.push(b));
    (data.bathrooms || []).forEach((b) => gather.push(b));

    // sum area in square metres
    const totalSqM = gather.reduce((acc, room) => {
      if (!room || !room.length || !room.width) return acc;
      const Lm = convertToMeters(room.length);
      const Wm = convertToMeters(room.width);
      if (!Lm || !Wm) return acc;
      return acc + (Lm * Wm);
    }, 0);

    // return human-friendly either sqm or sqft depending on unit
    if (unit === "ft") {
      // return total sq ft rounded
      return Math.round(totalSqM * 10.7639);
    } else {
      // return sqm rounded to 1 dp
      return Math.round(totalSqM * 10) / 10;
    }
  };

  // When unit changes convert existing numeric values *visually* kept as input (we keep inputs untouched).
  // We only need to re-calc the displayed sqft based on current numeric fields.
  useEffect(() => {
    setRooms((prev) => {
      const updated = { ...prev };
      updated.sqft = calculateTotalArea(prev);
      onChange({ ...updated, unit });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const inputClass = "input p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700";

  return (
    <div>
      {/* unit toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Units</span>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-1">
            <button
              className={`px-3 py-1 rounded-full text-sm ${unit === "m" ? "bg-white dark:bg-slate-700 shadow" : "text-gray-600 dark:text-gray-300"}`}
              onClick={() => setUnit("m")}
            >
              Metres (m)
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${unit === "ft" ? "bg-white dark:bg-slate-700 shadow" : "text-gray-600 dark:text-gray-300"}`}
              onClick={() => setUnit("ft")}
            >
              Feet (ft)
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Total area: <strong>{rooms.sqft || 0}</strong> {unit === "m" ? "m² (approx)" : "ft² (approx)"}
        </div>
      </div>

      {/* main rooms */}
      <div className="mb-4 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700">
        <h4 className="font-semibold mb-3">Main Rooms</h4>

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            placeholder={`Living ${unit} length`}
            value={rooms.living.length}
            onChange={(e) => updateRoom("living", null, "length", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder={`Living ${unit} width`}
            value={rooms.living.width}
            onChange={(e) => updateRoom("living", null, "width", e.target.value)}
          />

          <input
            className={inputClass}
            placeholder={`Kitchen ${unit} length`}
            value={rooms.kitchen.length}
            onChange={(e) => updateRoom("kitchen", null, "length", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder={`Kitchen ${unit} width`}
            value={rooms.kitchen.width}
            onChange={(e) => updateRoom("kitchen", null, "width", e.target.value)}
          />

          <input
            className={inputClass}
            placeholder={`Dining ${unit} length`}
            value={rooms.dining.length}
            onChange={(e) => updateRoom("dining", null, "length", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder={`Dining ${unit} width`}
            value={rooms.dining.width}
            onChange={(e) => updateRoom("dining", null, "width", e.target.value)}
          />
        </div>
      </div>

      {/* bedrooms */}
      <div className="mb-4 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Bedrooms</h4>
          <div className="flex gap-2">
            <button className="text-sm px-2 py-1 border rounded" onClick={() => addRoom("bedrooms")}>Add</button>
          </div>
        </div>

        <div className="space-y-3">
          {(rooms.bedrooms || []).map((b, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder={`Bedroom ${i + 1} ${unit} length`}
                value={b.length}
                onChange={(e) => updateRoom("bedrooms", i, "length", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className={inputClass + " flex-1"}
                  placeholder={`Bedroom ${i + 1} ${unit} width`}
                  value={b.width}
                  onChange={(e) => updateRoom("bedrooms", i, "width", e.target.value)}
                />
                <button className="px-3 py-1 border rounded" onClick={() => removeRoom("bedrooms", i)}>−</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bathrooms */}
      <div className="mb-4 p-3 border rounded bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Bathrooms</h4>
          <div className="flex gap-2">
            <button className="text-sm px-2 py-1 border rounded" onClick={() => addRoom("bathrooms")}>Add</button>
          </div>
        </div>

        <div className="space-y-3">
          {(rooms.bathrooms || []).map((b, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder={`Bathroom ${i + 1} ${unit} length`}
                value={b.length}
                onChange={(e) => updateRoom("bathrooms", i, "length", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className={inputClass + " flex-1"}
                  placeholder={`Bathroom ${i + 1} ${unit} width`}
                  value={b.width}
                  onChange={(e) => updateRoom("bathrooms", i, "width", e.target.value)}
                />
                <button className="px-3 py-1 border rounded" onClick={() => removeRoom("bathrooms", i)}>−</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* total sqft and manual override */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Total {unit === "m" ? "m² (approx)" : "ft² (approx)"}</label>
          <input
            className={inputClass}
            value={rooms.sqft || ""}
            onChange={(e) => {
              // manual override
              const val = e.target.value;
              setRooms((prev) => {
                const updated = { ...prev, sqft: val };
                onChange({ ...updated, unit });
                return updated;
              });
            }}
            placeholder={unit === "m" ? "e.g. 120.5" : "e.g. 1300"}
          />
        </div>

        <div className="w-44">
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="m">Metres (m)</option>
            <option value="ft">Feet (ft)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
