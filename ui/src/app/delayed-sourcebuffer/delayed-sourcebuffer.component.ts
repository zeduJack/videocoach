import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delayed-sourcebuffer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delayed-sourcebuffer.component.html',
  styleUrls: ['./delayed-sourcebuffer.component.scss']
})
export class DelayedSourcebufferComponent implements AfterViewInit  {

  @ViewChild('videoElement') videoElementRef!: ElementRef;
  mediaSource = new MediaSource();
  sourceBuffer!: SourceBuffer;
  // videoBuffer: Array<Uint8Array> = [];
  // bufferSizeLimit = 10 * 1000; // 10 seconds buffer size in milliseconds
  mediaRecorder!: MediaRecorder;

  counter = 0;

  constructor() {}

  ngAfterViewInit(): void {
    const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
    videoElement.src = URL.createObjectURL(this.mediaSource);
    this.mediaSource.addEventListener('sourceopen', this.setupSourceBuffer.bind(this), { once: true });
    this.captureVideo();
  }

  setupSourceBuffer() {
    this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  }

  captureVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="vp8"' });
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && !this.sourceBuffer.updating && this.mediaSource.readyState === 'open') {
              event.data.arrayBuffer().then((arrayBuffer) => {
                const uint8Array = new Uint8Array(arrayBuffer);
                // this.videoBuffer.push(uint8Array); // Assuming you're managing a buffer of Uint8Array objects
                // this.manageBuffer();
                this.sourceBuffer.appendBuffer(uint8Array);
                // this.counter++;
                // console.log(this.counter);
              });
            }
          };
          this.mediaRecorder.start(10); // Capture 1 second chunks
        })
        .catch(console.error);
  }

  // manageBuffer() {
  //   // This function manages the buffer to ensure it only keeps the last 10 seconds of video data
  //   let bufferLength = this.videoBuffer.reduce((acc, val) => acc + val.byteLength, 0);
  //   while (bufferLength > this.bufferSizeLimit) {
  //     const removed = this.videoBuffer.shift();
  //     if (removed) bufferLength -= removed.byteLength;
  //   }
  // }

  replayLastTenSeconds() {
    // This function would ideally calculate and append the last 10 seconds of buffered video for replay
    // Due to complexity, this is a conceptual placeholder
    // In a real implementation, you'd need to handle SourceBuffer updating, segmenting, and timestamp tracking
    console.log('Replay logic to be implemented');
  }
}
