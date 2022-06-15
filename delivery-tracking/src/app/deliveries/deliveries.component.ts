import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Delivery } from '../model/delivery';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveriesComponent {
  @Input() deliveries: Delivery[] = [];
}
