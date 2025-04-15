export const fetchBars = async (lat: number, lng: number): Promise<any[]> => {
  const radius = 1000; 
  const query = `
    [out:json];
    (
      node(around:${radius},${lat},${lng})["amenity"~"bar|pub"];
      way(around:${radius},${lat},${lng})["amenity"~"bar|pub"];
      relation(around:${radius},${lat},${lng})["amenity"~"bar|pub"];
    );
    out center tags;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.elements;
  } catch (error) {
    console.error("Overpass fetch error:", error);
    return [];
  }
};
