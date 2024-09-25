import {
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [NgStyle, HeaderComponent],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.scss',
})
export class ImageViewComponent implements OnInit {
  @Input({ required: true }) src = '';
  @ViewChild('mainImage') mainIamge!: ElementRef;

  scale = 1;
  panning = false;
  pointX = 0;
  pointY = 0;
  start = { x: 0, y: 0 };
  customStyle = signal({
    transform:
      'translate(' +
      this.pointX +
      'px, ' +
      this.pointY +
      'px) scale(' +
      this.scale +
      ')',
  });

  ngOnInit(): void {
    console.log(this.src);
  }

  transform() {
    this.customStyle.set({
      transform: `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`,
    });
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.start = {
      x: e.clientX - this.pointX,
      y: e.clientY - this.pointY,
    };
    this.panning = true;
  }
  onMouseUp() {
    this.panning = false;
  }
  onMouseMove(e: MouseEvent) {
    e.preventDefault();
    if (!this.panning) {
      return;
    }

    this.pointX = e.clientX - this.start.x;
    this.pointY = e.clientY - this.start.y;
    this.transform();
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    let delta = -e.deltaY;
    let xs = (e.clientX - this.pointX) / this.scale;
    let ys = (e.clientY - this.pointY) / this.scale;
    if (delta > 0) {
      this.scale *= 1.2;
    } else {
      this.scale /= 1.2;
    }
    this.pointX = e.clientX - xs * this.scale;
    this.pointY = e.clientY - ys * this.scale;
    this.transform();
  }
}
