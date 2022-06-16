import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Delivery } from '../model/delivery';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryComponent {
  @Input() delivery!: Delivery;

  get initials(): string {
    return this.delivery.destination.description[0] ?? '';
  }
}
