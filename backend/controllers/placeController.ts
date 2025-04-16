import { Request, Response } from "express";
import { fetchPlaceDetails } from "../services/placeService";

export const getPlaceDetails = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng query params" });
  }

  try {
    const place = await fetchPlaceDetails(Number(lat), Number(lng));
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place details" });
  }
};
