import { Coordinates } from "./coordinates";
import { Driver } from "./driver";

export interface Delivery {
  id?: string;
  destination: {
    description: string;
    coordinates: Coordinates;
  };
  driver?: Driver;
}