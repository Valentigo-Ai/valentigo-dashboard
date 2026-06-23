import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PropertyTypeSelect from "./PropertyTypeSelect";
import BedroomSelect from "./BedroomSelect";
import BathroomSelect from "./BathroomSelect";
import FurnishingTypeSelect from "./FurnishingTypeSelect";
import SizesDimensions from "./SizesDimensions";
import { Copy, Check, RefreshCw, Wand2 } from "lucide-react";

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "warm",         label: "Warm & Inviting" },
  { value: "luxury",       label: "Luxury / Prestige" },
  { value: "punchy",       label: "Compact & Punchy" },
];

const PARKING_OPTIONS = [
  "None",
  "On-street parking",
  "Residents permit parking",
  "Private driveway",
  "Garage",
  "Double garage",
  "Allocated parking space",
];

const GARDEN_OPTIONS = [
  "None",
  "Communal garden",
  "Small rear garden",
  "Landscaped garden",
  "Large private garden",
  "Balcony",
  "Roof terrace",
  "Front and rear garden",
];

const EPC_RATINGS = ["A", "B", "C", "D", "E", "F", "G"];

export default function PropertyDescriptionGenerator() {
  // Core fields
  const [listingType, setListingType] = useState("For Sale");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms]   = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [features, setFeatures]   = useState("");
  const [sizes, setSizes]         = useState({});
  const [showSizes, setShowSizes] = useState(false);

  // Additional fields
  const [tone, setTone]           = useState("professional");
  const [parking, setParking]     = useState("");
  const [garden, setGarden]       = useState("");
  const [transport, setTransport] = useState("");
  const [epc, setEpc]             = useState("");
  const [price, setPrice]         = useState("");

  // UI state
  const [error, setError]     = useState("");
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  // =====================================
  // VALIDATION
  // =====================================
  const validate = () => {
    if (!propertyType) return "Please select a property type.";
    if (!location)     return "Please enter the location.";
    if (!bedrooms)     return "Please select number of bedrooms.";
    if (!bathrooms)    return "Please select number of bathrooms.";
    return "";
  };

  // =====================================
  // GENERATE
  // =====================================
  const generate = async (mode) => {
    const errorMsg = validate();
    if (errorMsg) { setError(errorMsg); return; }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyDetails: {
            listingType,
            propertyType,
            location,
            bedrooms,
            bathrooms,
            furnishing,
            features,
            sizes,
            parking,
            garden,
            transport,
            epc,
            price,
          },
          tone,
          mode,
        }),
      });

      const data = await res.json();
      setResult(data.description || "No description returned from AI.");
    } catch (err) {
      console.error(err);
      setResult("Something went wrong while generating the description.");
    }

    setLoading(false);
  };

  // =====================================
  // COPY
  // =====================================
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =====================================
  // LABEL HELPERS
  // =====================================
  const labelClass = "block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300";
  const sectionClass = "mb-6";
  const sectionHeading = "text-base font-semibold mb-3 text-gray-900 dark:text-slate-100";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 size={22} className="text-[var(--accent)]" />
            Property Description Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Generate professional, Rightmove/Zoopla-ready property descriptions in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left column: form ── */}
          <div className="lg:col-span-3 space-y-0">

            {/* Listing type + Tone */}
            <div className={sectionClass}>
              <h3 className={sectionHeading}>Listing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Listing Type</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-slate-700">
                    {["For Sale", "To Let"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setListingType(t)}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                          listingType === t
                            ? "bg-[var(--accent)] text-white"
                            : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Tone of Voice</label>
                  <select
                    className="input w-full"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className={labelClass}>Price / Rent <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  className="input w-full"
                  placeholder={listingType === "To Let" ? "e.g. £1,800 pcm" : "e.g. £425,000"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Property details */}
            <div className={sectionClass}>
              <h3 className={sectionHeading}>Property Details</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <PropertyTypeSelect value={propertyType} onChange={setPropertyType} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className="input w-full"
                    placeholder="Area, town, or postcode (e.g. Fulham, SW6)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className={sectionClass}>
              <h3 className={sectionHeading}>Specifications</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <BedroomSelect value={bedrooms} onChange={setBedrooms} />
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <BathroomSelect value={bathrooms} onChange={setBathrooms} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Parking</label>
                  <select className="input w-full" value={parking} onChange={(e) => setParking(e.target.value)}>
                    <option value="">Select parking</option>
                    {PARKING_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Garden / Outdoor</label>
                  <select className="input w-full" value={garden} onChange={(e) => setGarden(e.target.value)}>
                    <option value="">Select outdoor space</option>
                    {GARDEN_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Interior & features */}
            <div className={sectionClass}>
              <h3 className={sectionHeading}>Interior & Features</h3>
              <div className="mb-3">
                <label className={labelClass}>Furnishing</label>
                <FurnishingTypeSelect value={furnishing} onChange={setFurnishing} />
              </div>
              <div>
                <label className={labelClass}>Key Features</label>
                <textarea
                  placeholder="e.g. open-plan kitchen, underfloor heating, period features, newly renovated bathroom"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="input w-full h-24 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Separate with commas. More detail = better description.</p>
              </div>
            </div>

            {/* Location extras */}
            <div className={sectionClass}>
              <h3 className={sectionHeading}>Location & Energy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nearest Station / Transport <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    className="input w-full"
                    placeholder="e.g. 5 mins to Clapham Junction"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>EPC Rating <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select className="input w-full" value={epc} onChange={(e) => setEpc(e.target.value)}>
                    <option value="">Select EPC rating</option>
                    {EPC_RATINGS.map((r) => <option key={r} value={r}>Band {r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Sizes (collapsible) */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={sectionHeading}>Sizes & Dimensions <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
                <button
                  type="button"
                  onClick={() => setShowSizes(!showSizes)}
                  className="text-sm text-[var(--accent)] hover:opacity-80"
                >
                  {showSizes ? "Hide ▲" : "Show ▼"}
                </button>
              </div>
              {showSizes && (
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  <SizesDimensions value={sizes} onChange={setSizes} />
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-red-700 bg-red-50 border border-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => generate("standard")}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-opacity"
              >
                <Wand2 size={16} />
                {loading ? "Generating…" : "Generate Description"}
              </button>
              <button
                onClick={() => generate("moreDetail")}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                title="Generate a longer, more detailed version"
              >
                <RefreshCw size={15} />
                More Detail
              </button>
            </div>
          </div>

          {/* ── Right column: output ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100">Generated Description</h4>
                  {result && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:opacity-80 transition-opacity"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>

                {result ? (
                  <>
                    <div className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed min-h-[200px]">
                      {result}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs text-gray-400">
                      <span>{result.length} characters</span>
                      <span>{result.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-sm text-gray-400 dark:text-slate-500">
                    {loading
                      ? "Writing your description…"
                      : "Fill in the details and click Generate."}
                  </div>
                )}
              </div>

              {/* Portal tips */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p className="font-semibold">Portal guidelines</p>
                <p>Rightmove recommends 1,000–3,000 characters. Zoopla works best at 150–500 words.</p>
                <p>Avoid misleading claims. Descriptions must comply with the Consumer Protection from Unfair Trading Regulations 2008.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
