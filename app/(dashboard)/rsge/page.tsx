"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowsClockwise, CheckCircle, Warning, Clock, FileText } from "@phosphor-icons/react";
import { Empty, PageHeader, Panel } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { gel } from "@/lib/data";
import { fmtShort } from "@/lib/dates";

export default function RsgePage() {
  const { hotel, sendInvoice, syncAll } = useHotel();
  const [syncing, setSyncing] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drop a pending sync if the page unmounts mid-run.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";
  const sent = hotel.syncLog.filter((l) => l.status === "ok").length;
  const errors = hotel.syncLog.filter((l) => l.status === "error").length;

  function handleSync() {
    setSyncing(true);
    setDone(false);
    timer.current = setTimeout(() => {
      syncAll();
      setSyncing(false);
      setDone(true);
    }, 1800);
  }

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="RS.ge სინქ."
        sub={`შემოსავლების სამსახური · ${hotel.name}`}
        action={
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              background: syncing ? "var(--bg)" : done ? "#065F46" : "var(--acc)",
              color: syncing ? "var(--txt3)" : "#fff",
              border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: syncing ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6, transition: "background 300ms",
            }}
          >
            <ArrowsClockwise size={14} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} />
            {syncing ? "სინქ. მიმდინარეობს..." : done ? "სინქ. დასრულდა ✓" : "სინქ. RS.ge-სთან"}
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: CheckCircle, label: "გაგზავნილი ფაქტ.", value: String(sent), color: "var(--acc-txt)", bg: "var(--acc-s)" },
          { icon: Clock, label: "გასაგზავნი", value: String(hotel.pendingInvoices.length), color: "var(--amb-txt)", bg: "var(--amb-s)" },
          { icon: Warning, label: "შეცდომები", value: String(errors), color: "var(--rose-txt)", bg: "var(--rose-s)" },
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <Panel title="სინქ. ლოგი">
          {hotel.syncLog.map((l, i) => (
            <div key={`${l.time}-${l.action}`} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px", borderBottom: i < hotel.syncLog.length - 1 ? "1px solid var(--bdr)" : "none" }}>
              <div style={{ marginTop: 1, flexShrink: 0 }}>
                {l.status === "ok"
                  ? <CheckCircle size={14} color="#10B981" weight="fill" />
                  : <Warning size={14} color="#EF4444" weight="fill" />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--txt)" }}>{l.action}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{l.time}</div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="გასაგზავნი ფაქტ." pad>
          {hotel.pendingInvoices.length === 0 ? (
            <Empty>ყველა ფაქტურა გაგზავნილია ✓</Empty>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hotel.pendingInvoices.map((p) => (
                <div key={p.id} style={{ background: "var(--bg)", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--txt3)" }}>{p.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>{gel(p.amount)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 8 }}>{guestName(p.guestId)}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--txt3)" }}>{fmtShort(p.date)}</span>
                    <button onClick={() => sendInvoice(p.id)} style={{ fontSize: 11, color: "var(--acc)", background: "var(--acc-s)", border: "none", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={11} />გაგზავნა
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
