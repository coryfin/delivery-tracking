import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, of, take, tap } from 'rxjs';
import { Coordinates } from '../model/coordinates';
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
          description: 'Walmart South Salt Lake',
          coordinates: {
            latitude: 40.7404778,
            longitude: -111.97124,
          },
        },
        driver: {
          id: '1',
          name: 'Johnny Appleseed',
          location: {
            latitude: 40.7,
            longitude: -111.9,
          },
        },
      },
      {
        id: '456',
        destination: {
          description: 'Walmart Parleys',
          coordinates: {
            latitude: 40.7200194,
            longitude: -111.8132876,
          },
        },
      },
      {
        id: '789',
        destination: {
          description: 'Walmart Murray',
          coordinates: {
            latitude: 40.6696785,
            longitude: -111.8635658,
          },
        },
        driver: {
          id: '2',
          name: 'Paul Bunyan',
          location: {
            latitude: 40.7,
            longitude: -111.9,
          },
        },
      },
    ]);

    this.drivers.next([
      {
        id: '1',
        name: 'Johnny Appleseed',
        location: {
          latitude: 40.7,
          longitude: -111.9,
        },
      },
      {
        id: '2',
        name: 'Paul Bunyan',
        location: {
          latitude: 40.7,
          longitude: -111.9,
        },
      },
    ]);

    this.startSimulation();
  }

  getDeliveries(): Observable<Delivery[]> {
    return this.deliveries.asObservable();
  }

  getDriverLocation(driverId: string): Observable<Coordinates | undefined> {
    return this.getDrivers().pipe(
      map(drivers => drivers.find(d => d.id === driverId)),
      map(driver => driver?.location),
    );
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
  
  private startSimulation(): void {
    setInterval(() => {
      const drivers = this.drivers.getValue().map(driver => {
        return driver && {
          ...driver,
          location: driver.location && this.move(driver.location, 0, 0.00001),
        };
      });
      this.drivers.next(drivers);
    }, 50);
  }

  private move(coordinates: Coordinates, lat: number, long: number): Coordinates {
    return {
      latitude: coordinates.latitude + lat,
      longitude: coordinates.longitude + long,
    };
  }
}
