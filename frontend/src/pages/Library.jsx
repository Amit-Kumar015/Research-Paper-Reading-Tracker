import { useEffect, useState } from "react";
import {
  researchDomains,
  readingStages,
  impactScores,
  dateFilters,
} from "../data/constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPapers } from "@/services/library";

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
        params.append(
          "domains",
          filters.domains.join(",")
        );
      }

      if (filters.stages.length) {
        params.append(
          "stages",
          filters.stages.join(",")
        );
      }

      if (filters.impacts.length) {
        params.append(
          "impacts",
          filters.impacts.join(",")
        );
      }

      params.append(
        "dateFilter",
        filters.dateFilter
      );

      const {data} = await getAllPapers(params.toString());
      setPapers(data.data);
    } catch (error) {
      console.error(error);
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
      {/* Heading */}

      <div>
        <h1 className="text-3xl font-bold">
          Paper Library
        </h1>

        <p className="text-slate-500">
          Browse and filter research papers
        </p>
      </div>

      {/* Filters */}

      <div className="grid gap-4 md:grid-cols-4">
        {/* Domains */}

        <Card>
          <CardHeader>
            <CardTitle>
              Research Domain
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {researchDomains.map((domain) => (
              <div
                key={domain}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={filters.domains.includes(
                    domain
                  )}
                  onCheckedChange={() =>
                    toggleFilter(
                      "domains",
                      domain
                    )
                  }
                />

                <label className="text-sm">
                  {domain.replaceAll("_", " ")}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reading Stages */}

        <Card>
          <CardHeader>
            <CardTitle>
              Reading Stage
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {readingStages.map((stage) => (
              <div
                key={stage}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={filters.stages.includes(
                    stage
                  )}
                  onCheckedChange={() =>
                    toggleFilter(
                      "stages",
                      stage
                    )
                  }
                />

                <label className="text-sm">
                  {stage.replaceAll("_", " ")}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Impact */}

        <Card>
          <CardHeader>
            <CardTitle>
              Impact Score
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {impactScores.map((impact) => (
              <div
                key={impact}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={filters.impacts.includes(
                    impact
                  )}
                  onCheckedChange={() =>
                    toggleFilter(
                      "impacts",
                      impact
                    )
                  }
                />

                <label className="text-sm">
                  {impact.replaceAll("_", " ")}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date Filter */}

        <Card>
          <CardHeader>
            <CardTitle>
              Date Added
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {dateFilters.map((date) => (
              <div
                key={date.value}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={
                    filters.dateFilter ===
                    date.value
                  }
                  onCheckedChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFilter: date.value,
                    }))
                  }
                />

                <label className="text-sm">
                  {date.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table */}

      <Card>
        <CardHeader>
          <CardTitle>
            Research Papers
          </CardTitle>
        </CardHeader>

        <CardContent>
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
                <TableRow>
                  <TableHead>
                    Paper Title
                  </TableHead>

                  <TableHead>
                    Author
                  </TableHead>

                  <TableHead>
                    Domain
                  </TableHead>

                  <TableHead>
                    Stage
                  </TableHead>

                  <TableHead>
                    Citations
                  </TableHead>

                  <TableHead>
                    Impact
                  </TableHead>

                  <TableHead>
                    Date Added
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell className="font-medium">
                      {paper.paperTitle}
                    </TableCell>

                    <TableCell>
                      {paper.firstAuthorName}
                    </TableCell>

                    <TableCell>
                      {paper.researchDomain.replaceAll(
                        "_",
                        " "
                      )}
                    </TableCell>

                    <TableCell>
                      {paper.readingStage.replaceAll(
                        "_",
                        " "
                      )}
                    </TableCell>

                    <TableCell>
                      {paper.citationCount}
                    </TableCell>

                    <TableCell>
                      {paper.impactScore.replaceAll(
                        "_",
                        " "
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        paper.dateAdded
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Library;