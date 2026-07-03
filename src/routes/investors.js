import express from "express";
import {
  getAllInvestors,
  createInvestorsBulk,
  portfolioSummary,
  getSchemeWiseSummary,
} from "../controllers/investorController.js";

const router = express.Router();

router.get("/", getAllInvestors);
router.post("/createInvestors", createInvestorsBulk);
router.get("/:investorId/summary", portfolioSummary);
router.get("/:investorId/schemeSummary", getSchemeWiseSummary);

export default router;
