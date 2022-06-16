import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Driver } from '../model/driver';
import { DeliveryService } from '../service/delivery.service';

@Component({
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {

  $drivers?: Observable<Driver[]>;

  description: string = '';
  driver?: Driver;

  constructor(private deliveryService: DeliveryService, private matDialogRef: MatDialogRef<AddDeliveryComponent>) { }

  ngOnInit(): void {
    this.$drivers = this.deliveryService.getDrivers();
  }

  submit(): void {
    this.deliveryService.addDelivery({
      destination: {
        description: this.description,
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      driver: this.driver,
    }).subscribe(() => {
      this.matDialogRef.close();
    });
  }
}
