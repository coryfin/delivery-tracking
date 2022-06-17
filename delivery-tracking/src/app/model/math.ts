import { Coordinates } from "./coordinates";

export function midpoint(a: Coordinates, b: Coordinates): Coordinates {
  return {
    latitude: (a.latitude + b.latitude) / 2,
    longitude: (a.longitude + b.longitude) / 2,
  };
}

export function move(coordinates: Coordinates, lat: number, long: number): Coordinates {
  return {
    latitude: coordinates.latitude + lat,
    longitude: coordinates.longitude + long,
  };
}

export function calculateNextStep(origin: Coordinates, destination: Coordinates): Coordinates {
  const a = destination.latitude - origin.latitude;
  const b = destination.longitude - origin.longitude;
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  const z = 0.00001;

  // If a step would take you past the destination
  if (c < z) {
    // Don't step
    return {
      latitude: 0,
      longitude: 0,
    }
  }

  return {
    latitude: a * z / c,
    longitude: b * z / c,
  };
}