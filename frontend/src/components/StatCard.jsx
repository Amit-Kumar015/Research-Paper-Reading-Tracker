import { C } from "@/data/colors";

function StatCard({ label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: C.muted }}
      >
        {label}
      </p>
      <p className="text-4xl font-bold tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

export { StatCard };