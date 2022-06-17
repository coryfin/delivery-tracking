import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Driver } from '../model/driver';
import { isMapMouseEvent } from '../model/google-map-helpers';
import { DeliveryService } from '../service/delivery.service';

@Component({
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {

  $drivers?: Observable<Driver[]>;

  description: string = '';
  driver?: Driver;
  zoom: number = 10;
  center: google.maps.LatLngLiteral = { lat: 40.7662899, lng: -112.0484876 };
  marker: google.maps.LatLngLiteral | undefined;

  constructor(private deliveryService: DeliveryService, private matDialogRef: MatDialogRef<AddDeliveryComponent>) { }

  ngOnInit(): void {
    this.$drivers = this.deliveryService.getDrivers().pipe(take(1));
  }

  get canSubmit(): boolean {
    return !!this.description && !!this.marker;
  }

  onMapClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    if (isMapMouseEvent(event) && event.latLng) {
      this.marker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    }
  }

  submit(): void {
    this.deliveryService.addDelivery({
      destination: {
        description: this.description,
        coordinates: {
          latitude: this.marker!.lat,
          longitude: this.marker!.lng,
        },
      },
      driver: this.driver,
    }).subscribe(() => {
      this.matDialogRef.close();
    });
  }
}
