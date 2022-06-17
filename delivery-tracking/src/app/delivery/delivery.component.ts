import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { from, map, mergeMap, Observable, of, Subscription, take } from 'rxjs';
import { Delivery } from '../model/delivery';
import { DeliveryService } from '../service/delivery.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryComponent implements OnInit, OnDestroy {
  @Input() delivery!: Delivery;

  zoom: number = 15;
  center!: google.maps.LatLngLiteral;
  icon: google.maps.Icon = {
    url: 'https://cdn2.iconfinder.com/data/icons/e-commerce-317/32/shipping_truck_map_trucking-512.png',
    scaledSize: new google.maps.Size(50, 50),
  };

  destinationPosition!: google.maps.LatLngLiteral;
  position: google.maps.LatLngLiteral | undefined;
  private markerSubscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef, private deliveryService: DeliveryService) {
  }

  ngOnInit(): void {
    this.initCenter();
    this.initDestinationPosition();
    this.initMarkerPosition();
  }

  ngOnDestroy(): void {
    if (this.markerSubscription) {
      this.markerSubscription.unsubscribe();
      this.markerSubscription = undefined;
    }
  }

  get initials(): string {
    return this.delivery.destination.description[0] ?? '';
  }

  get hasDriver(): boolean {
    return !!this.delivery.driver?.name;
  }

  private initCenter(): void {
    this.center = {
      lat: this.delivery.destination.coordinates.latitude,
      lng: this.delivery.destination.coordinates.longitude,
    };
  }

  private initDestinationPosition(): void {
    this.destinationPosition = {
      lat: this.delivery.destination.coordinates.latitude,
      lng: this.delivery.destination.coordinates.longitude,
    };
  }

  private initMarkerPosition(): void {
    if (this.delivery.driver?.id) {
      this.markerSubscription = this.deliveryService.getDriverLocation(this.delivery.driver.id).pipe(
        map(coordinates => {
          return coordinates && {
            lat: coordinates!.latitude,
            lng: coordinates!.longitude,
          };
        }),
      ).subscribe(coordinates => {
        this.position = coordinates;
        this.center = coordinates ?? this.center;
        this.cdr.markForCheck();
      });
    }
  }
}
