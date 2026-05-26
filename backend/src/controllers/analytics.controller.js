import db from "../database/database.js";

const getAnalytics = async (req, res) => {
  try {
    const papers = await db.paper.findMany();

    const stages = [
      "ABSTRACT_READ",
      "INTRODUCTION_DONE",
      "METHODOLOGY_DONE",
      "RESULTS_ANALYZED",
      "FULLY_READ",
      "NOTES_COMPLETED",
    ];

    const funnelData = stages.map((stage) => {
      return {
        stage,
        count: papers.filter((paper) => paper.readingStage === stage).length,
      };
    });

    const scatterData = papers.map((paper) => ({
      citations: paper.citationCount,
      impactScore: paper.impactScore,
      title: paper.paperTitle,
    }));

    const domains = [
      "COMPUTER_SCIENCE",
      "BIOLOGY",
      "PHYSICS",
      "CHEMISTRY",
      "MATHEMATICS",
      "SOCIAL_SCIENCES",
    ];

    const stackedBarData = domains.map((domain) => {
      const domainPapers = papers.filter(
        (paper) => paper.researchDomain === domain,
      );

      const stageCounts = {};

      stages.forEach((stage) => {
        stageCounts[stage] = domainPapers.filter(
          (paper) => paper.readingStage === stage,
        ).length;
      });

      return {
        domain,
        ...stageCounts,
      };
    });

    const papersByStage = {};

    stages.forEach((stage) => {
      papersByStage[stage] = papers.filter(
        (paper) => paper.readingStage === stage,
      ).length;
    });

    const avgCitationsPerDomain = {};

    domains.forEach((domain) => {
      const domainPapers = papers.filter(
        (paper) => paper.researchDomain === domain,
      );

      const total = domainPapers.reduce(
        (sum, paper) => sum + paper.citationCount,
        0,
      );

      avgCitationsPerDomain[domain] =
        domainPapers.length > 0 ? Math.round(total / domainPapers.length) : 0;
    });

    const fullyReadCount = papers.filter(
      (paper) => paper.readingStage === "FULLY_READ",
    ).length;

    const completionRate =
      papers.length > 0
        ? ((fullyReadCount / papers.length) * 100).toFixed(2)
        : 0;

    return res.status(200).json({
      success: true,

      data: {
        funnelData,
        scatterData,
        stackedBarData,

        summary: {
          totalPapers: papers.length,
          papersByStage,
          avgCitationsPerDomain,
          completionRate,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

export { getAnalytics };
