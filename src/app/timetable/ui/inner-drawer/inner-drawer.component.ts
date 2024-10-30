import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TripInfo } from '../../services/train/train.service';

@Component({
  selector: 'app-inner-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inner-drawer.component.html',
  styleUrls: ['./inner-drawer.component.scss'],
})
export class InnerDrawerComponent {
  private _trip?: TripInfo; // Example type

  @Input()
  set trip(value: TripInfo | undefined) {
    this._trip = value;
  }

  get trip() {
    return this._trip;
  }

  @Output() closeDrawerEmitter = new EventEmitter<void>();

  closeDrawer() {
    this.closeDrawerEmitter.emit();
  }
}
