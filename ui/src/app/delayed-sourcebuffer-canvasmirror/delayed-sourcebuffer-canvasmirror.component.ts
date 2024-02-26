import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delayed-sourcebuffer-canvasmirror',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delayed-sourcebuffer-canvasmirror.component.html',
  styleUrls: ['./delayed-sourcebuffer-canvasmirror.component.scss']
})
export class DelayedSourcebufferCanvasmirrorComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElementRef!: ElementRef;
  @ViewChild('canvasElement') canvasElementRef!: ElementRef;

  canvas: any;
  ctx: any;

  ngAfterViewInit(): void {
    this.canvas = this.canvasElementRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.setupVideoStream();
  }

  setupVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
          videoElement.srcObject = stream;
          videoElement.play();
          this.processVideoStream();
        })
        .catch(console.error);
  }

  processVideoStream() {
    const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;

    videoElement.addEventListener('play', () => {
      this.canvas.width = videoElement.videoWidth;
      this.canvas.height = videoElement.videoHeight;

      const draw = () => {
        if (!videoElement.paused && !videoElement.ended) {
          this.ctx.save();
          this.ctx.scale(-1, 1); // Flip video frame horizontally
          this.ctx.translate(-this.canvas.width, 0); // Move canvas context back into view
          this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);
          this.ctx.restore();
          requestAnimationFrame(draw);
        }
      };

      draw();
    });
  }
}
