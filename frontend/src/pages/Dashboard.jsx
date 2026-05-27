import { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { getAnalytics } from "@/services/analytics";
import { C, FUNNEL_COLORS, STAGE_COLORS } from "@/data/colors";
import { StatCard } from "@/components/StatCard";
import { Panel } from "@/components/Panel";
import { ChartTooltip } from "@/components/ChartToolTip";
import { toast } from "sonner";

const IMPACT_Y = { LOW_IMPACT: 1, MEDIUM_IMPACT: 2, HIGH_IMPACT: 3 };
const IMPACT_LABEL = { 1: "Low", 2: "Medium", 3: "High", 4: "Unknown" };

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAnalytics();
        setAnalytics(data.data);
      } catch (e) {
        const msg = e?.response?.data?.message || "Failed to load analytics";
        console.error(msg);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: C.bg }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#6366f1", borderRightColor: "#3b82f6" }}
          />
          <p className="text-sm" style={{ color: C.muted }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: C.bg }}
      >
        <p style={{ color: "#f43f5e" }}>Failed to load analytics data.</p>
      </div>
    );
  }

  const { funnelData, scatterData, stackedBarData, summary } = analytics;

  const mappedScatter = scatterData.map((d) => ({
    ...d,
    citationCount: d.citations,
    impactY: IMPACT_Y[d.impactScore] ?? 4,
  }));

  const maxCitations = Math.max(
    ...Object.values(summary.avgCitationsPerDomain),
    1,
  );

  return (
    <div className="min-h-screen">
      <div className="px-3 space-y-8">
        <div
          className="flex items-end justify-between border-b pb-6"
          style={{ borderColor: C.border }}
        >
          <div>
            <h1 className="mt-1 text-3xl font-bold" style={{ color: C.text }}>
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: C.subtext }}>
              Paper insights &amp; reading progress
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Papers"
            value={summary.totalPapers}
            accent="#6366f1"
          />
          <StatCard
            label="Completion Rate"
            value={`${summary.completionRate}%`}
            accent="#3b82f6"
          />
          <StatCard
            label="Fully Read"
            value={summary.papersByStage["FULLY_READ"]}
            accent="#f59e0b"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Reading Stage Funnel" subtitle="Pipeline">
            <div className="w-full flex flex-col items-center gap-3 py-6">
              {funnelData.map((item, index) => {
                const isZero = item.count === 0;

                const width = isZero ? "100%" : `${100 - index * 12}%`;

                if (isZero) {
                  return (
                    <div
                      key={item.stage}
                      className="w-full flex items-center gap-3"
                    >
                      <div className="flex-1 h-px bg-slate-300" />

                      <span className="text-xs text-slate-400 uppercase tracking-wide whitespace-nowrap">
                        {item.stage.replaceAll("_", " ")} — 0
                      </span>

                      <div className="flex-1 h-px bg-slate-300" />
                    </div>
                  );
                }

                return (
                  <div key={item.stage} className="flex justify-center w-full">
                    <div
                      className={`h-14 flex items-center justify-center px-5 text-white font-semibold shadow-md
                transition-all duration-500 bg-gradient-to-r rounded-sm ${FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
              `}
                      style={{
                        width,
                        clipPath: "polygon(0% 0%, 100% 0%, 94% 100%, 6% 100%)",
                      }}
                    >
                      <span className="text-sm uppercase truncate">
                        {item.stage.replaceAll("_", " ")}
                      </span>

                      <span className="text-lg font-bold ml-4">
                        {item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Citation Count vs Impact Score" subtitle="Correlation">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke={C.border} />
                  <XAxis
                    type="number"
                    dataKey="citationCount"
                    name="Citations"
                    tick={{ fill: C.subtext, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: C.border }}
                    label={{
                      value: "Citations",
                      position: "insideBottom",
                      offset: -10,
                      fill: C.muted,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="impactY"
                    name="Impact"
                    domain={[0, 4]}
                    ticks={[1, 2, 3, 4]}
                    tickFormatter={(v) => IMPACT_LABEL[v] ?? ""}
                    tick={{ fill: C.subtext, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: C.border }}
                  />
                  <ZAxis range={[80]} />
                  <Tooltip
                    cursor={{ stroke: C.border }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div
                          className="rounded-xl px-4 py-3 text-xs shadow-lg"
                          style={{
                            background: C.card,
                            border: `1px solid ${C.border}`,
                            color: C.text,
                          }}
                        >
                          <p className="mb-1 font-semibold max-w-[180px] truncate">
                            {d.title}
                          </p>
                          <p>
                            Citations:{" "}
                            <span className="font-bold">
                              {d.citationCount?.toLocaleString()}
                            </span>
                          </p>
                          <p>
                            Impact:{" "}
                            <span className="font-bold">
                              {d.impactScore?.replaceAll("_", " ")}
                            </span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Papers" data={mappedScatter}>
                    {mappedScatter.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i % 2 === 0 ? "#6366f1" : "#3b82f6"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel
          title="Papers by Domain &amp; Reading Stage"
          subtitle="Distribution"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedBarData} barCategoryGap="35%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="domain"
                  tick={{ fill: C.subtext, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: C.border }}
                  tickFormatter={(v) => v.replaceAll("_", " ")}
                />
                <YAxis
                  tick={{ fill: C.subtext, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    color: C.subtext,
                    paddingTop: 16,
                  }}
                  formatter={(v) => v.replaceAll("_", " ")}
                />
                {Object.entries(STAGE_COLORS).map(([stage, color], i, arr) => (
                  <Bar
                    key={stage}
                    dataKey={stage}
                    stackId="a"
                    fill={color}
                    radius={i === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Papers by Reading Stage" subtitle="Breakdown">
            <div className="space-y-4">
              {Object.entries(summary.papersByStage).map(([stage, count]) => {
                const pct =
                  summary.totalPapers > 0
                    ? (count / summary.totalPapers) * 100
                    : 0;
                const color = STAGE_COLORS[stage] ?? "#6366f1";
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs font-medium"
                        style={{ color: C.subtext }}
                      >
                        {stage.replaceAll("_", " ")}
                      </span>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: C.text }}
                      >
                        {count}
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full"
                      style={{ background: C.border }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: color,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Avg Citations by Domain" subtitle="Impact">
            <div className="space-y-4">
              {Object.entries(summary.avgCitationsPerDomain).map(
                ([domain, avg]) => {
                  const pct = (avg / maxCitations) * 100;
                  return (
                    <div key={domain}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: C.subtext }}
                        >
                          {domain.replaceAll("_", " ")}
                        </span>
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{ color: C.text }}
                        >
                          {avg.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className="h-1.5 w-full rounded-full"
                        style={{ background: C.border }}
                      >
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #6366f1, #3b82f6)",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
