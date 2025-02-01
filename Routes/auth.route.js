import express from "express";
import { BookForAnEvent } from "../controllers/bookEvent.js";

const router = express.Router();
router.get("/booking", BookForAnEvent);

export default router;
