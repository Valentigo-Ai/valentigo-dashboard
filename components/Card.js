import React from "react";
import clsx from "clsx";

export default function Card({ title, value, icon: Icon, accent }) {
  return (
    <div
      className={clsx(
        "card p-6 rounded-2xl transition-all duration-400 shadow-lg",
        "hover:translate-y-[-3px] hover:shadow-xl",
        "flex items-center justify-between gap-4"
      )}
      style={{
        background: "var(--panel)",
        boxShadow: "var(--shadow)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <h3 className="text-[var(--muted)] text-sm font-medium">{title}</h3>
        <p className="text-3xl font-semibold text-[var(--text)] mt-2">
          {value}
        </p>
      </div>

      <div
        className={clsx(
          "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300",
          "bg-gradient-to-br"
        )}
        style={{
          background: `linear-gradient(135deg, ${accent || "var(--accent)"}, ${
            accent ? accent + "cc" : "var(--accent-2)"
          })`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        }}
      >
        {Icon && <Icon size={24} className="text-[#04202b]" />}
      </div>
    </div>
  );
}
