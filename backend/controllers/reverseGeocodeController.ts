import { Request, Response } from "express";
import reverseGeocodeService from "../services/reverseGeocodeService";

const getReverseGeocode = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (typeof lat !== "string" || typeof lng !== "string") {
    return res.status(400).json({ error: "Invalid parameters, lat and lng are required" });
  }

  try {
    const address = await reverseGeocodeService.getFormattedAddress(parseFloat(lat), parseFloat(lng));
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: "Error fetching reverse geocoding data" });
  }
};

export default { getReverseGeocode };
