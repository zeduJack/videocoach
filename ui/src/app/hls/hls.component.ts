import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import Hls from "hls.js";

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hls.component.html',
  styleUrls: ['./hls.component.scss']
})
export class HlsComponent  implements OnInit {
  @ViewChild('video', { static: true }) videoElement!: ElementRef;

  private hls!: Hls;
  private videoSrc = 'assets/hls/stream.m3u8'; // Replace with your HLS URL

  constructor() {}

  ngOnInit(): void {
    this.setupVideoPlayer();
  }

  private setupVideoPlayer(): void {
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.videoSrc);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }

  startHls() {
    fetch("http://localhost:8080/starthls");
  }
}
