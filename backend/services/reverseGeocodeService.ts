import fetch from "node-fetch";

interface BigDataCloudResponse {
  locality?: string;
  principalSubdivision?: string;
  postcode?: string;
  localityInfo?: {
    administrative?: { name: string }[];
  };
}

const getFormattedAddress = async (lat: number, lng: number): Promise<{
  city?: string;
  state?: string;
  zipCode?: string;
}> => {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

  try {
    const response = await fetch(url);
    const data = await response.json() as BigDataCloudResponse;

    return {
      city: data.locality || '',
      state: data.principalSubdivision || '',
      zipCode: data.postcode || '',
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    throw new Error("Failed to fetch geocoding info");
  }
};

export default { getFormattedAddress };
