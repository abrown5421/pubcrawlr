import { Request, Response } from "express";
import { fetchPlaceMatch } from "../services/placeService";

export const getPlaceDetails = async (req: Request, res: Response) => {
  const { name, lat, lng } = req.query;

  if (!name || !lat || !lng) {
    return res.status(400).json({ error: "Missing name, lat, or lng query params" });
  }

  try {
    const place = await fetchPlaceMatch(String(name), Number(lat), Number(lng));
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place match" });
  }
};
