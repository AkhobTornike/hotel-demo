"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowsClockwise, CheckCircle, Warning, Clock, FileText } from "@phosphor-icons/react";

const SYNC_LOG = [
  { time: "28 ივნ 14:30", action: "ფაქტური JV-1042 გაგზავნილი RS.ge-ზე", status: "ok" },
  { time: "28 ივნ 11:05", action: "ფაქტური JV-1040 გაგზავნილი RS.ge-ზე", status: "ok" },
  { time: "27 ივნ 18:30", action: "ფაქტური JV-1041 გაგზავნილი RS.ge-ზე", status: "ok" },
  { time: "25 ივნ 09:15", action: "ავტომატური სინქ — 3 ფაქტური", status: "ok" },
  { time: "23 ივნ 12:45", action: "ფაქტური JV-1035 — კავშირის შეცდომა", status: "error" },
  { time: "23 ივნ 12:50", action: "ხელახლა გაგზავნა JV-1035 — წარმატება", status: "ok" },
  { time: "20 ივნ 08:00", action: "ავტომატური სინქ — 5 ფაქტური", status: "ok" },
  { time: "15 ივნ 08:00", action: "RS.ge API კალიბრაცია", status: "ok" },
];

const INITIAL_PENDING = [
  { id: "JV-1039", guest: "ნინო კვარაცხელია", amount: "₾220", date: "29 ივნ" },
  { id: "JV-1038", guest: "მარიამ გელაშვილი", amount: "₾410", date: "30 ივნ" },
  { id: "JV-1037", guest: "David Johnson",      amount: "₾560", date: "01 ივლ" },
];

export default function RsgePage() {
  const [syncing, setSyncing] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [log, setLog] = useState(SYNC_LOG);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending sync if the page unmounts mid-run.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function handleSync() {
    setSyncing(true);
    setDone(false);
    timer.current = setTimeout(() => {
      setSyncing(false);
      setDone(true);
      if (pending.length) {
        setLog((l) => [
          { time: "ახლა", action: `ავტომატური სინქ — ${pending.length} ფაქტური`, status: "ok" },
          ...l,
        ]);
        setPending([]);
      }
    }, 2200);
  }

  /** Send one invoice to RS.ge: drop it from the queue and record it in the log. */
  function sendInvoice(id: string) {
    setPending((p) => p.filter((x) => x.id !== id));
    setLog((l) => [{ time: "ახლა", action: `ფაქტური ${id} გაგზავნილი RS.ge-ზე`, status: "ok" }, ...l]);
  }

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>RS.ge სინქ.</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>შემოსავლების სამსახური &middot; ბოლო სინქ: 28 ივნ 14:30</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: syncing ? "var(--bg)" : done ? "#065F46" : "var(--acc)",
            color: syncing ? "var(--txt3)" : "#fff",
            border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: syncing ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 6, transition: "background 300ms",
          }}
        >
          <ArrowsClockwise size={14} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} />
          {syncing ? "სინქ. მიმდინარეობს..." : done ? "სინქ. დასრულდა ✓" : "სინქ. RS.ge-სთან"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: CheckCircle, label: "გაგზავნილი ფაქტ.", value: String(47 + (INITIAL_PENDING.length - pending.length)), color: "#065F46", bg: "rgba(16,185,129,.1)" },
          { icon: Clock,       label: "გაგზავნა გვიანდება", value: String(pending.length),  color: "#92400E", bg: "rgba(245,158,11,.1)" },
          { icon: Warning,     label: "შეცდომები",          value: "1",  color: "#991B1B", bg: "rgba(239,68,68,.1)" },
        ].map((c) => (
          <div key={c.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <c.icon size={18} color={c.color} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--txt3)" }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--txt)" }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        {/* Log */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bdr)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>სინქ. ლოგი</h2>
          </div>
          <div style={{ padding: 0 }}>
            {log.map((l, i) => (
              <div key={`${l.time}-${l.action}`} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px", borderBottom: i < log.length - 1 ? "1px solid var(--bdr)" : "none" }}>
                <div style={{ marginTop: 1, flexShrink: 0 }}>
                  {l.status === "ok"
                    ? <CheckCircle size={14} color="#10B981" weight="fill" />
                    : <Warning size={14} color="#EF4444" weight="fill" />
                  }
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--txt)" }}>{l.action}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{l.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending invoices */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bdr)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>გასაგზავნი ფაქტ.</h2>
          </div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.length === 0 && (
              <div style={{ padding: "20px 4px", textAlign: "center", fontSize: 12, color: "var(--txt3)" }}>
                ყველა ფაქტური გაგზავნილია ✓
              </div>
            )}
            {pending.map((p) => (
              <div key={p.id} style={{ background: "var(--bg)", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--txt3)" }}>{p.id}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>{p.amount}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 8 }}>{p.guest}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--txt3)" }}>{p.date}</span>
                  <button onClick={() => sendInvoice(p.id)} style={{ fontSize: 11, color: "var(--acc)", background: "var(--acc-s)", border: "none", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <FileText size={11} />გაგზავნა
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
