import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { from, map, mergeMap, Observable, of, Subscription, take } from 'rxjs';
import { Delivery } from '../model/delivery';
import { DeliveryService } from '../service/delivery.service';
import {Coordinates, toCoordinates, toPosition} from '../model/coordinates';
import { midpoint } from '../model/math';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryComponent implements OnInit, OnDestroy {
  @Input() delivery!: Delivery;

  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  icon: google.maps.Icon = {
    url: 'https://cdn2.iconfinder.com/data/icons/e-commerce-317/32/shipping_truck_map_trucking-512.png',
    scaledSize: new google.maps.Size(50, 50),
  };
  
  zoom: number = 15;
  center!: google.maps.LatLngLiteral;
  position: google.maps.LatLngLiteral | undefined;
  destination!: google.maps.LatLngLiteral;

  private centered: boolean = false;
  private markerSubscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef, private deliveryService: DeliveryService) {
  }

  ngOnInit(): void {
    this.initCenter();
    this.initDestination();
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

  private initDestination(): void {
    this.destination = {
      lat: this.delivery.destination.coordinates.latitude,
      lng: this.delivery.destination.coordinates.longitude,
    };
  }

  private initMarkerPosition(): void {
    if (this.delivery.driver?.id) {
      this.markerSubscription = this.deliveryService.getDriverLocation(this.delivery.driver.id).pipe(
        map(coordinates => {
          return coordinates && toPosition(coordinates);
        }),
      ).subscribe(position => {
        if (position && this.position && (position.lat !== this.position.lat || position.lng !== this.position.lng) && !this.centered) {
          this.centerOnRoute();
          this.centered = true;
        }
        this.position = position;
        this.cdr.markForCheck();
      });
    }
  }

  private centerOnRoute(): void {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(this.destination);
    if (this.position) {
      bounds.extend(this.position);
      const centerCoordinates = midpoint(toCoordinates(this.destination), toCoordinates(this.position));
      this.center = toPosition(centerCoordinates);
    }
    this.googleMap.fitBounds(bounds, 40);
    if (this.googleMap.getZoom() ?? 0 < 4) {
      this.zoom = 4;
      this.cdr.markForCheck();
    }
  }
}
