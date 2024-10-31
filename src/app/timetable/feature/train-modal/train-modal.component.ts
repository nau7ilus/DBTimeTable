import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { TrainService, TripInfo } from '../../services/train/train.service';

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

  constructor(private renderer: Renderer2) { }

  getNextStopIndex() {
    return this.trip.stopovers.findIndex(so => new Date(so.departure).getTime() > Date.now())
  }

  closeModal() {
    this.dialog.nativeElement.close();
    this.dialog.nativeElement.classList.remove('opened');
  }

  openModal() {
    this.dialog.nativeElement.showModal();
    this.dialog.nativeElement.classList.add('opened');
  }

  scrollToLastStation(): void {
    const targetElement = this.renderer.selectRootElement(`#station-${this.getNextStopIndex()}`, true);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatTime(dateTimeString: string): string {
    return TrainService.formatTime(dateTimeString);
  }

  ngAfterViewInit() {
    if (this.isOpened) this.openModal()

    setTimeout(() => {
      this.scrollToLastStation()
    }, 600)

    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.nodeName === 'DIALOG') {
        this.closeModal();
      }
    });
  }
}
