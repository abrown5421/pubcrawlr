import axios from "axios";

export const fetchPlaceDetails = async (lat: number, lng: number) => {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: apiKey!,
      },
    });

    const place = response.data.results[0];
    return place;
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};
