import { Router } from "express";
import { createPaper, getPapers } from "../controllers/paper.controller.js";

const paperRouter = Router()

paperRouter.get("/", getPapers)
paperRouter.post("/", createPaper)

export default paperRouter;