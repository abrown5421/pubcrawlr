import axios from "axios";

export const fetchPlaceMatch = async (name: string, lat: number, lng: number) => {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  const ll = `${lat},${lng}`;

  const url = `https://api.foursquare.com/v3/places/match?name=${encodeURIComponent(name)}&ll=${ll}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: apiKey!,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching matched place:", error);
    throw error;
  }
};
