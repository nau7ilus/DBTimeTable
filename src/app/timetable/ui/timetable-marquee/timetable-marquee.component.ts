import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timetable-marquee',
  standalone: true,
  imports: [],
  templateUrl: './timetable-marquee.component.html',
  styleUrl: './timetable-marquee.component.scss'
})
export class TimetableMarqueeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marqueeContainer') marqueeContainer!: ElementRef;
  @ViewChild('marqueeText') marqueeText!: ElementRef;
  private observer!: IntersectionObserver;
  private mutationObserver!: MutationObserver;
  private animationFrameId: number | null = null;
  private isVisible = false;
  private currentLeft = 0;
  private speed = 1.3;
  private containerWidth!: number;
  private textWidth!: number;

  constructor(private renderer: Renderer2) { }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.stopAnimation()
  }

  ngAfterViewInit(): void {
    this.containerWidth = this.marqueeContainer.nativeElement.offsetWidth;
    this.textWidth = this.marqueeText.nativeElement.offsetWidth;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.startAnimation();
        } else {
          this.isVisible = false;
          this.stopAnimation();
        }
      });
    });

    this.observer.observe(this.marqueeContainer.nativeElement);

    this.mutationObserver = new MutationObserver(() => {
      this.updateDimensions();
    });

    this.mutationObserver.observe(this.marqueeText.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  private updateDimensions(): void {
    this.containerWidth = this.marqueeContainer.nativeElement.offsetWidth;
    this.textWidth = this.marqueeText.nativeElement.offsetWidth;
    this.currentLeft = 0;
  }

  private startAnimation(): void {
    if (this.animationFrameId) return;

    const animate = () => {
      if (!this.isVisible) return;

      this.currentLeft = this.textWidth > this.containerWidth ? this.currentLeft - this.speed : 0;
      this.renderer.setStyle(this.marqueeText.nativeElement, 'left', `${this.currentLeft}px`);

      if (this.currentLeft < -this.textWidth) {
        this.currentLeft = this.containerWidth;
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

}
