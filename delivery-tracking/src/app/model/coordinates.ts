export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function toCoordinates(position: google.maps.LatLngLiteral): Coordinates {
  return {
    latitude: position.lat,
    longitude: position.lng,
  };
}

export function toPosition(coordinates: Coordinates): google.maps.LatLngLiteral {
  return {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };
}