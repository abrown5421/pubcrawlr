export const fetchBars = async (lat: number, lng: number): Promise<any[]> => {
  const radius = 2000; 
  const query = `
    [out:json];
    (
      node(around:${radius},${lat},${lng})["amenity"~"bar|pub|cocktail_bar|wine_bar|tavern|beer_garden|taproom|brewpub|speakeasy|distillery|brewery|winery|cidery|club|nightclub|lounge|karaoke|disco"];
      way(around:${radius},${lat},${lng})["amenity"~"bar|pub|cocktail_bar|wine_bar|tavern|beer_garden|taproom|brewpub|speakeasy|distillery|brewery|winery|cidery|club|nightclub|lounge|karaoke|disco"];
      relation(around:${radius},${lat},${lng})["amenity"~"bar|pub|cocktail_bar|wine_bar|tavern|beer_garden|taproom|brewpub|speakeasy|distillery|brewery|winery|cidery|club|nightclub|lounge|karaoke|disco"];
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
