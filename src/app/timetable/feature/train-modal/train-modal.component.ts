import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TripInfo } from '../../services/train/train.service';

@Component({
  selector: 'app-train-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './train-modal.component.html',
  styleUrl: './train-modal.component.scss'
})
export class TrainModalComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  @Input() trip!: TripInfo;
  isOpened = false;

  closeModal() {
    this.dialog.nativeElement.close();
    this.dialog.nativeElement.classList.remove('opened');
  }

  openModal() {
    this.dialog.nativeElement.showModal();
    this.dialog.nativeElement.classList.add('opened');
  }

  ngAfterViewInit() {
    if (this.isOpened) this.openModal()

    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.nodeName === 'DIALOG') {
        this.closeModal();
      }
    });
  }
}
