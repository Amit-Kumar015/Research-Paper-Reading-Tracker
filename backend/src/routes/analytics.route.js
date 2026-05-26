import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const analyticsRouter = Router()

analyticsRouter.get("/", getAnalytics)

export default analyticsRouter;