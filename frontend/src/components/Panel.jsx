import { C } from "@/data/colors";

function Panel({ title, subtitle, children }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
      }}
    >
      {title && (
        <div className="mb-5">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: C.muted }}
          >
            {subtitle ?? "Analytics"}
          </p>
          <h2
            className="mt-0.5 text-base font-semibold"
            style={{ color: C.text }}
          >
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}

export { Panel };