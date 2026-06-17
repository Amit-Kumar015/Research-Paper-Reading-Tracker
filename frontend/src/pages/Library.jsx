import { useEffect, useState } from "react";
import {
  researchDomains,
  readingStages,
  impactScores,
  dateFilters,
} from "../data/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPapers } from "@/services/library";
import { toast } from "sonner";

function Library() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    domains: [],
    stages: [],
    impacts: [],
    dateFilter: "ALL_TIME",
  });

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.domains.length) {
        params.append("domains", filters.domains.join(","));
      }

      if (filters.stages.length) {
        params.append("stages", filters.stages.join(","));
      }

      if (filters.impacts.length) {
        params.append("impacts", filters.impacts.join(","));
      }

      params.append("dateFilter", filters.dateFilter);

      const { data } = await getAllPapers(params.toString());
      setPapers(data.data);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to fetch papers";
      console.error(msg);
      toast.error("Failed to fetch papers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [filters]);

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);

      return {
        ...prev,

        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paper Library</h1>

        <p className="text-slate-500">Browse and filter research papers</p>
      </div>

      <div
        className="rounded-xl px-4 py-2"
        style={{
          background: "#ffffff",
          border: "1px solid #e4e7ef",
          boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div className="mb-3 text-xl font-semibold tracking-tight">Filters</div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-700 font-semibold uppercase tracking-widest w-28 shrink-0">
              Domain
            </span>
            <div className="flex flex-wrap gap-2">
              {researchDomains.map((domain) => {
                const active = filters.domains.includes(domain);
                return (
                  <button
                    key={domain}
                    onClick={() => toggleFilter("domains", domain)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: active ? "#6366f1" : "#f3f4f6",
                      color: active ? "#ffffff" : "#6b7280",
                      border: `1px solid ${active ? "#6366f1" : "#e4e7ef"}`,
                    }}
                  >
                    {domain.replaceAll("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-700 font-semibold uppercase tracking-widest w-28 shrink-0">
              Stage
            </span>
            <div className="flex flex-wrap gap-2">
              {readingStages.map((stage) => {
                const active = filters.stages.includes(stage);
                return (
                  <button
                    key={stage}
                    onClick={() => toggleFilter("stages", stage)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: active ? "#3b82f6" : "#f3f4f6",
                      color: active ? "#ffffff" : "#6b7280",
                      border: `1px solid ${active ? "#3b82f6" : "#e4e7ef"}`,
                    }}
                  >
                    {stage.replaceAll("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-700 font-semibold uppercase tracking-widest w-28 shrink-0">
              Impact
            </span>
            <div className="flex flex-wrap gap-2">
              {impactScores.map((impact) => {
                const active = filters.impacts.includes(impact);
                const accentMap = {
                  HIGH_IMPACT: { on: "#10b981", off: "#f3f4f6" },
                  MEDIUM_IMPACT: { on: "#f59e0b", off: "#f3f4f6" },
                  LOW_IMPACT: { on: "#6b7280", off: "#f3f4f6" },
                };
                const accent = accentMap[impact] ?? {
                  on: "#6366f1",
                  off: "#f3f4f6",
                };
                return (
                  <button
                    key={impact}
                    onClick={() => toggleFilter("impacts", impact)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: active ? accent.on : accent.off,
                      color: active ? "#ffffff" : "#6b7280",
                      border: `1px solid ${active ? accent.on : "#e4e7ef"}`,
                    }}
                  >
                    {impact.replaceAll("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-700 font-semibold uppercase tracking-widest w-28 shrink-0">
              Date Added
            </span>
            <div className="flex flex-wrap gap-2">
              {dateFilters.map((date) => {
                const active = filters.dateFilter === date.value;
                return (
                  <button
                    key={date.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        dateFilter: active ? null : date.value,
                      }))
                    }
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: active ? "#8b5cf6" : "#f3f4f6",
                      color: active ? "#ffffff" : "#6b7280",
                      border: `1px solid ${active ? "#8b5cf6" : "#e4e7ef"}`,
                    }}
                  >
                    {date.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">
            Research Papers
          </h3>
        </div>

        <div>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : papers.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No papers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-lg font-semibold">
                  <TableHead>Paper Title</TableHead>

                  <TableHead>Author</TableHead>

                  <TableHead>Domain</TableHead>

                  <TableHead>Stage</TableHead>

                  <TableHead>Citations</TableHead>

                  <TableHead>Impact</TableHead>

                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.id} className="text-gray-800">
                    <TableCell className="font-medium">
                      {paper.paperTitle}
                    </TableCell>

                    <TableCell>{paper.firstAuthorName}</TableCell>

                    <TableCell>
                      {paper.researchDomain.replaceAll("_", " ")}
                    </TableCell>

                    <TableCell>
                      {paper.readingStage.replaceAll("_", " ")}
                    </TableCell>

                    <TableCell>{paper.citationCount}</TableCell>

                    <TableCell>
                      {paper.impactScore.replaceAll("_", " ")}
                    </TableCell>

                    <TableCell>
                      {new Date(paper.dateAdded).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;
