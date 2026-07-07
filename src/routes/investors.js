import express from "express";
import {
  getAllInvestors,
  createInvestorsBulk,
  portfolioSummary,
  getSchemeWiseSummary,
} from "../controllers/investorController.js";
import multer from "multer";

const router = express.Router();

// 1. Configure multer (memory storage is fine for this)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllInvestors);
router.post("/createInvestors", upload.single("file"), createInvestorsBulk);
router.get("/:investorId/summary", portfolioSummary);
router.get("/:investorId/schemeSummary", getSchemeWiseSummary);

export default router;
