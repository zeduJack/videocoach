import {Component, Injectable, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


@Injectable({
  providedIn: 'root'
})
export class VideoService {


}

@Component({
  selector: 'app-buffer-viewer',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './buffer-viewer.component.html',
  styleUrls: ['./buffer-viewer.component.scss']
})
export class BufferViewerComponent implements OnInit {

  private videoUrl = 'http://localhost:8080/buffer/video';
  getVideoStream(): Observable<Blob> {
    return this.http.get(this.videoUrl, { responseType: 'blob' });
  }

  videoSrc!: SafeUrl;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getVideoStream().subscribe(data => {
      const blob = new Blob([data], { type: 'video/h264' });
      this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    });
  }
}
