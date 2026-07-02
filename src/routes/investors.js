import express from "express";
import {
  getAllInvestors,
  createInvestorsBulk,
  portfolioSummary,
} from "../controllers/investorController.js";

const router = express.Router();

router.get("/", getAllInvestors);
router.post("/createInvestors", createInvestorsBulk);
router.get("/:investorId/summary", portfolioSummary); // New route for portfolio summary
// Add specific routes here: router.get('/:id', getInvestorSummary), etc.

export default router;
