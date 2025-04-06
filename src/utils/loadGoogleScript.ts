import { Loader } from "@googlemaps/js-api-loader";

export const loadGoogleMapsScript = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_PLACES_API_KEY!,
    libraries: ["places"],
  });

  return loader.load();
};
