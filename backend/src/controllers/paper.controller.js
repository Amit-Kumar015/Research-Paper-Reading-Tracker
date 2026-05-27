import db from "../database/database.js";

const createPaper = async (req, res) => {
  try {
    const {
      paperTitle,
      firstAuthorName,
      researchDomain,
      readingStage,
      citationCount,
      impactScore,
      dateAdded,
    } = req.body;
    
    if (
      !paperTitle ||
      !firstAuthorName ||
      !researchDomain ||
      !readingStage ||
      citationCount === undefined ||
      !impactScore
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const paper = await db.paper.create({
      data: {
        paperTitle,
        firstAuthorName,
        researchDomain,
        readingStage,
        citationCount: Number(citationCount),
        impactScore,
        dateAdded: dateAdded ? new Date(dateAdded) : new Date(),
      }
    })

    return res.status(201).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    console.error(error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to create paper",
    });
  }
};

const getPapers = async (req, res) => {
  try {
    const {
      domains,
      stages,
      impacts,
      dateFilter,
    } = req.query;

    const whereClause = {}

    if (domains) {
      whereClause.researchDomain = {
        in: domains.split(","),
      };
    }

    if (stages) {
      whereClause.readingStage = {
        in: stages.split(","),
      };
    }

    if (impacts) {
      whereClause.impactScore = {
        in: impacts.split(","),
      };
    }

    if (dateFilter && dateFilter !== "ALL_TIME") {
      const now = new Date();

      let startDate = new Date();

      if (dateFilter === "THIS_WEEK") {
        startDate.setDate(now.getDate() - 7);
      }

      if (dateFilter === "THIS_MONTH") {
        startDate.setMonth(now.getMonth() - 1);
      }

      if (dateFilter === "LAST_3_MONTHS") {
        startDate.setMonth(now.getMonth() - 3);
      }

      whereClause.dateAdded = {
        gte: startDate,
      };
    }

    const papers = await db.paper.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: papers,
    });
  } catch (error) {
    console.error(error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch papers",
    });
  }
}

export {
  createPaper,
  getPapers,
};
