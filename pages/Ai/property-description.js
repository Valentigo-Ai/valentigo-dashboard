import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";

export default function PropertyDescriptionGenerator() {
  const user = useUser();
  const [form, setForm] = useState({
    propertyType: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    features: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const propertyDetails = `
      Property Type: ${form.propertyType}
      Location: ${form.location}
      Bedrooms: ${form.bedrooms}
      Bathrooms: ${form.bathrooms}
      Features: ${form.features}
    `;

    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyDetails }),
      });

      const data = await res.json();
      setResult(data.description || "No description generated.");
    } catch (error) {
      console.error("Error:", error);
      setResult("❌ Something went wrong while generating the description.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return <p className="text-center mt-8">Please log in to use this tool.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🏠 Property Description Generator
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="propertyType"
          placeholder="Property Type (e.g. Villa, Apartment)"
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
        <input
          name="location"
          placeholder="Location (e.g. Malibu, London)"
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
        <input
          name="bedrooms"
          placeholder="Bedrooms (e.g. 3)"
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <input
          name="bathrooms"
          placeholder="Bathrooms (e.g. 2)"
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <textarea
          name="features"
          placeholder="Key Features (comma separated)"
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Description"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Generated Description:</h2>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:underline"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}
