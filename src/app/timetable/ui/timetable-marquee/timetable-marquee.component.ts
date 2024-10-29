import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timetable-marquee',
  standalone: true,
  imports: [],
  templateUrl: './timetable-marquee.component.html',
  styleUrl: './timetable-marquee.component.scss'
})
export class TimetableMarqueeComponent implements AfterViewInit {
  @Input() speed = 100;

  @ViewChild('marqueeContainer') marqueeContainer!: ElementRef;
  @ViewChild('marqueeText') marqueeText!: ElementRef;

  constructor(private renderer: Renderer2) { }

  get textWidth() {
    return this.marqueeText.nativeElement.offsetWidth
  }

  get containerWidth() {
    return this.marqueeContainer.nativeElement.offsetWidth;
  }

  ngAfterViewInit() {
    let currentLeft = 0;
    const speed = 1.3;

    const animate = () => {
      currentLeft = this.textWidth > this.containerWidth ? currentLeft - speed : 0;


      this.renderer.setStyle(this.marqueeText.nativeElement, 'left', `${currentLeft}px`)

      if (currentLeft < -this.textWidth) {
        currentLeft = this.containerWidth;
      }

      requestAnimationFrame(animate)
    }

    animate()
  }
}
