export const fetchBars = (lat: number, lng: number): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const location = new google.maps.LatLng(lat, lng);

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: 'bar',
      keyword: 'bar OR pub OR drinks OR cocktails'
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(results)
        resolve(results);
      } else {
        reject(`PlacesService error: ${status}`);
      }
    });
  });
};
