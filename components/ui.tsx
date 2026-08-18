"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";

export function Badge({ tone, children }: { tone: { color: string; bg: string }; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: tone.color, background: tone.bg, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBox({
  value, onChange, placeholder, width = 220,
}: { value: string; onChange: (v: string) => void; placeholder: string; width?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: "6px 12px", width }}>
      <MagnifyingGlass size={14} color="var(--txt3)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", fontSize: 13, color: "var(--txt)", background: "transparent", flex: 1, minWidth: 0 }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)", display: "flex", padding: 0 }}>
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export function FilterPills({
  options, value, onChange,
}: { options: { key: string; label: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <>
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid",
            background: value === key ? "var(--txt)" : "var(--panel)",
            color: value === key ? "#fff" : "var(--txt2)",
            borderColor: value === key ? "var(--txt)" : "var(--bdr)",
          }}
        >
          {label}
        </button>
      ))}
    </>
  );
}

export function Panel({ title, extra, children, pad = false }: { title?: string; extra?: React.ReactNode; children: React.ReactNode; pad?: boolean }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bdr)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>{title}</h2>
          {extra}
        </div>
      )}
      <div style={pad ? { padding: 16 } : undefined}>{children}</div>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".04em" }}>
      {children}
    </th>
  );
}

export function Td({ children, mono, strong, dim }: { children: React.ReactNode; mono?: boolean; strong?: boolean; dim?: boolean }) {
  return (
    <td style={{
      padding: "12px 16px",
      fontSize: mono || dim ? 12 : 13,
      fontFamily: mono ? "var(--mono)" : undefined,
      fontWeight: strong ? 600 : 400,
      color: dim || mono ? "var(--txt3)" : strong ? "var(--txt)" : "var(--txt2)",
    }}>
      {children}
    </td>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "36px 16px", textAlign: "center", fontSize: 13, color: "var(--txt3)" }}>{children}</div>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "var(--acc-s)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, color: "var(--acc)", flexShrink: 0,
    }}>
      {name.charAt(0)}
    </div>
  );
}
