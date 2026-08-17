import Sidebar from "@/components/Sidebar";
import { HotelProvider } from "@/contexts/HotelContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HotelProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </HotelProvider>
  );
}
