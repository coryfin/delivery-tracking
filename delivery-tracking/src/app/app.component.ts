import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from './model/delivery';
import { DeliveryService } from './service/delivery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Delivery Tracking';

  $deliveries?: Observable<Delivery[]>;

  constructor(private deliveryService: DeliveryService) {
  }

  ngOnInit(): void {
    this.$deliveries = this.deliveryService.getDeliveries();
    this.$deliveries?.subscribe(value => {
      console.log(value);
    });
  }
}
