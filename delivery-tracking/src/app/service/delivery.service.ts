import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, of, take, tap } from 'rxjs';
import { Coordinates } from '../model/coordinates';
import { Delivery } from '../model/delivery';
import { Driver } from '../model/driver';
import { calculateNextStep, move } from '../model/math';

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
          latitude: 40.7662899,
          longitude: -112.0484876,
        },
      },
      {
        id: '2',
        name: 'Paul Bunyan',
        location: {
          latitude: 40.7662899,
          longitude: -112.0484876,
        },
      },
      {
        id: '3',
        name: 'John Henry',
        location: {
          latitude: 40.7662899,
          longitude: -112.0484876,
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

  assignDriver(deliveryId: string, driverId: string): void {
    const driver = this.drivers.getValue().find(driver => driver.id === driverId);
    let delivery = this.deliveries.getValue().find(delivery => delivery.id === deliveryId);

    const updatedDeliveries = this.deliveries.getValue().map(d => {
      if (d === delivery) {
        return {
          ...d,
          driver,
        };
      } else {
        return d;
      }
    });
    this.deliveries.next(updatedDeliveries)
  }
  
  private startSimulation(): void {
    setInterval(() => {
      const drivers = this.drivers.getValue().map(driver => {
        const delivery = this.deliveries.getValue().find(delivery => delivery.driver?.id === driver.id);
        const nextStep = driver?.location && delivery && calculateNextStep(driver.location, delivery?.destination.coordinates);
        return driver && {
          ...driver,
          location: driver.location && move(driver.location, nextStep?.latitude ?? 0, nextStep?.longitude ?? 0),
        };
      });
      this.drivers.next(drivers);
    }, 50);
  }
}
