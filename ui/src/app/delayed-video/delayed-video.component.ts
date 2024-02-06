import {Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delayed-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delayed-video.component.html',
  styleUrls: ['./delayed-video.component.scss']
})
export class DelayedVideoComponent {
  @ViewChild('videoElement') videoElementRef!: ElementRef;
  @ViewChild('canvasElement') canvasElementRef!: ElementRef;
  @ViewChild('delayedECanwas') delayedCanvas!: ElementRef;
  @ViewChild('slider') sliderElementRef!: ElementRef;
  video: any;
  canvas: any;
  delayed: any;
  ctx: any;
  ctxDelayed: any;

  videoChunks: any [] = [];
  private bufferSize = 240; // for 2 second s

  counter = 0;

  ngAfterViewInit(): void {
    this.video = this.videoElementRef.nativeElement;
    this.canvas = this.canvasElementRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.delayed = this.delayedCanvas.nativeElement;
    this.ctxDelayed = this.delayed.getContext('2d');

    const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
          .then((stream) => {
            videoElement.srcObject = stream;
          })
          .catch((error) => {
            console.error('Error accessing the camera:', error);
          });
    }

    this.video.addEventListener('play', () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      this.delayed.width = this.video.videoWidth;
      this.delayed.height = this.video.videoHeight;

      this.draw();
    });


    // setInterval(() => {
    //     console.log(this.counter);
    //     this.counter = 0;
    // }, 1000);
  }

  draw = () => {
    if (this.video.paused || this.video.ended) return;
    this.counter++;
    this.maintainBufferSize();
    if (this.videoChunks.length > 2) {
      let index = Number(this.sliderElementRef.nativeElement.value) === 0 ? 0 :
          (this.sliderElementRef.nativeElement.value - 2);
      // console.log('slider value', this.sliderElementRef.nativeElement.value)
      // console.log('index', index);

      this.ctxDelayed.drawImage(this.videoChunks[index], 0, 0, this.delayed.width, this.delayed.height)
    }
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    let dataUrl = this.canvas.toDataURL('image/jpeg');
    const image = new Image();
    image.src = dataUrl;
    this.videoChunks.push(image);
    requestAnimationFrame(this.draw);
  }


  private maintainBufferSize(): void {
    // Ensure we only keep the last 10 seconds of video
    const chunksPerSecond = 1; // Assuming 1 chunk per second for simplicity
    while (this.videoChunks.length > this.bufferSize * chunksPerSecond) {
      this.videoChunks.shift(); // Remove the oldest chunk
    }
  }
}
