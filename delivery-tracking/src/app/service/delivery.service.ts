import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Delivery } from '../model/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private deliveries = new ReplaySubject<Delivery[]>();

  constructor() {
    this.deliveries.next([
      {
        id: '123',
        destination: {
          description: 'Albertsons Grocery',
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        driver: {
          name: 'Johnny Appleseed'
        },
      },
      {
        id: '456',
        destination: {
          description: 'Walmart',
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
      },
      {
        id: '789',
        destination: {
          description: 'CVS',
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        driver: {
          name: 'Paul Bunyan'
        },
      },
    ]);
  }

  getDeliveries(): Observable<Delivery[]> {
    return this.deliveries.asObservable();
  }
}
