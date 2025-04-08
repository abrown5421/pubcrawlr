export const fetchBars = (lat: number, lng: number): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const location = new google.maps.LatLng(lat, lng);

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 1000,
      type: 'bar',
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(`PlacesService error: ${status}`);
      }
    });
  });
};
