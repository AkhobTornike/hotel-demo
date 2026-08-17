"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";

/** Shared overlay + card shell. Closes on backdrop click and on Escape. */
export default function Modal({
  onClose,
  width = 420,
  children,
}: {
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--panel)", borderRadius: 16, padding: 28, width,
          maxWidth: "100%", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, sub, onClose }: { title: React.ReactNode; sub?: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)", flexShrink: 0 }}>
        <X size={18} />
      </button>
    </div>
  );
}

export function ModalActions({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>{children}</div>;
}

export function GhostButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ onClick, color = "var(--acc)", children }: { onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 0", borderRadius: 8, border: "none", background: color, color: "#fff",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}
    >
      {children}
    </button>
  );
}

export function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 5 }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}
      />
    </div>
  );
}
