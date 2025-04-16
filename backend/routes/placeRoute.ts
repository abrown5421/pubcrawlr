import express from "express";
import { getPlaceDetails } from "../controllers/placeController";

const router = express.Router();

router.get("/place", getPlaceDetails);

export default router;
