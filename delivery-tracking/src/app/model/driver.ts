import { Coordinates } from "./coordinates";

export interface Driver {
  id: string;
  name: string;
  location?: Coordinates;
}