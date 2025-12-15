import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PropertyTypeSelect from "./PropertyTypeSelect";
import BedroomSelect from "./BedroomSelect";
import BathroomSelect from "./BathroomSelect";
import FurnishingTypeSelect from "./FurnishingTypeSelect";
import SizesDimensions from "./SizesDimensions";

export default function PropertyDescriptionGenerator() {
  // form state
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [features, setFeatures] = useState("");
  const [sizes, setSizes] = useState({});
  const [showSizes, setShowSizes] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // LIVE PREVIEW
  // =====================================
  useEffect(() => {
    let p = "";

    if (propertyType) p += `${propertyType}`;
    if (bedrooms) p += ` • ${bedrooms} ${bedrooms === "1" ? "bedroom" : "bedrooms"}`;
    if (bathrooms) p += ` • ${bathrooms} ${bathrooms === "1" ? "bathroom" : "bathrooms"}`;
    if (location) p += ` • Located in ${location}`;
    if (p) p += "\n\n";

    if (furnishing) p += `Furnishing: ${furnishing}.\n\n`;

    if (features) {
      const list = features.split(",").map(f => f.trim()).filter(Boolean);
      if (list.length) {
        p += `Key Features:\n- ${list.join("\n- ")}\n\n`;
      }
    }

    if (sizes && Object.keys(sizes).length > 0) {
      if (sizes.sqft) {
        p += `Size: Approx ${sizes.sqft} sq ft.\n`;
      }
    }

    setPreview(p.trim());
  }, [propertyType, bedrooms, bathrooms, location, furnishing, features, sizes]);

  // =====================================
  // VALIDATION
  // =====================================
  const validate = () => {
    if (!propertyType) return "Please select a property type.";
    if (!location) return "Please enter the location.";
    if (!bedrooms) return "Please select bedrooms.";
    if (!bathrooms) return "Please select bathrooms.";
    return "";
  };

  // =====================================
  // GENERATE (STANDARD + MORE DETAIL)
  // =====================================
  const generate = async (mode) => {
    const errorMsg = validate();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyDetails: {
            propertyType,
            location,
            bedrooms,
            bathrooms,
            furnishing,
            features,
            sizes,
          },
          mode,
        }),
      });

      const data = await res.json();
      setResult(data.description || "No description returned from AI.");
    } catch (err) {
      console.error(err);
      setResult("Error generating description.");
    }

    setLoading(false);
  };

  // =====================================
  // SAVE LOCALLY
  // =====================================
  const handleSave = () => {
    const data = {
      propertyType,
      location,
      bedrooms,
      bathrooms,
      furnishing,
      features,
      sizes,
      preview,
      generated: result,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("property_description_saved", JSON.stringify(data));
    alert("Saved to localStorage");
  };

  // =====================================
  // UI
  // =====================================
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          🏡 Property Description Generator
        </h1>

        {/* PROPERTY DETAILS */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Property Details</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Property Type
              </label>
              <PropertyTypeSelect
                value={propertyType}
                onChange={setPropertyType}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                className="input w-full"
                placeholder="Enter postcode / area (e.g. SW1A)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Specifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <BedroomSelect value={bedrooms} onChange={setBedrooms} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <BathroomSelect value={bathrooms} onChange={setBathrooms} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Furnishing</label>
            <FurnishingTypeSelect value={furnishing} onChange={setFurnishing} />
          </div>
        </div>

        {/* FEATURES */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Interior & Features</h3>
          <label className="block text-sm font-medium mb-1">Key Features</label>
          <textarea
            placeholder="Key features (comma separated)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="input w-full h-24"
          />
        </div>

        {/* SIZES */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Sizes & Dimensions</h3>
            <button
              onClick={() => setShowSizes(!showSizes)}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              {showSizes ? "Hide ▲" : "Show ▼"}
            </button>
          </div>

          {showSizes && (
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <SizesDimensions value={sizes} onChange={setSizes} />
            </div>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 rounded text-red-700 bg-red-100 border border-red-200">
            {error}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => generate("standard")}
            disabled={loading}
            className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Description"}
          </button>

          <button
            className="bg-gray-800 hover:bg-gray-900 text-white py-3 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        <button
          onClick={() => generate("moreDetail")}
          disabled={loading}
          className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Regenerate (More Detail)"}
        </button>

        {/* PREVIEW + RESULT */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold mb-2">Live Preview</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {preview || "Your description will appear here…"}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold mb-2">Generated Description</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {result || "No generated description yet."}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
