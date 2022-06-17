export function isMapMouseEvent(value: google.maps.MapMouseEvent | google.maps.IconMouseEvent): value is google.maps.MapMouseEvent {
  return (value as google.maps.MapMouseEvent).latLng != undefined;
}