import express from "express";
import { BookForAnEvent } from "../controllers/bookEvent.js";
import { getAllHalls } from "../controllers/hallController.js";
import { postHall } from "../controllers/hallController.js";
const router = express.Router();
router.get("/booking", BookForAnEvent); // GET /api/booking
router.get("/gethalls", getAllHalls); // GET /api/gethalls
router.post("/posthall", postHall); // POST /api/posthall

export default router;
// In the above code, we have defined three routes:
