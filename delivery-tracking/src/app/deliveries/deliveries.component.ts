import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Delivery } from '../model/delivery';
import { AddDeliveryComponent } from '../add-delivery/add-delivery.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeliveryService } from '../service/delivery.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveriesComponent {
  $deliveries?: Observable<Delivery[]>;

  constructor(private deliveryService: DeliveryService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.$deliveries = this.deliveryService.getDeliveries();
    this.$deliveries?.subscribe(value => {
      console.log(value);
    });
  }

  addDelivery(): void {
    this.matDialog.open(AddDeliveryComponent);
  }
}
