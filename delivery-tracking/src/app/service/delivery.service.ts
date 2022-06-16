import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject, take, tap } from 'rxjs';
import { Delivery } from '../model/delivery';
import { Driver } from '../model/driver';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private deliveries = new BehaviorSubject<Delivery[]>([]);
  private drivers = new BehaviorSubject<Driver[]>([]);

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
          id: '1',
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
          id: '2',
          name: 'Paul Bunyan'
        },
      },
    ]);

    this.drivers.next([
      {
        id: '1',
        name: 'Johnny Appleseed',
      },
      {
        id: '2',
        name: 'Paul Bunyan',
      },
    ]);
  }

  getDeliveries(): Observable<Delivery[]> {
    return this.deliveries.asObservable();
  }

  addDelivery(delivery: Delivery): Observable<Delivery> {
    return this.getDeliveries().pipe(
      take(1),
      tap(deliveries => {
        // Assign an id
        const nextId = (Math.max(...deliveries.map(d => Number.parseInt(d.id ?? '0'))) + 1).toString();
        delivery = {
          ...delivery,
          id: nextId,
        };
        this.deliveries.next([...deliveries, delivery]);
      }),
      map(() => delivery),
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.drivers.asObservable();
  }
}
