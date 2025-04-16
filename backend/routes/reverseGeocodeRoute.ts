import { Router } from "express";
import reverseGeocodeController from "../controllers/reverseGeocodeController";

const router = Router();

router.get("/reverse-geocode", reverseGeocodeController.getReverseGeocode);

export default router;
