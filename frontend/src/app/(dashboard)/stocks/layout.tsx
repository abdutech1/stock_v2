import Protected from "@/components/Protected";

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return <Protected requireRole="OWNER">{children}</Protected>;
}