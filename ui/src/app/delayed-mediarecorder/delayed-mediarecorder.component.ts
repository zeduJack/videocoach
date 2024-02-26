import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-delayed-mediarecorder',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delayed-mediarecorder.component.html',
    styleUrls: ['./delayed-mediarecorder.component.scss']
})
export class DelayedMediarecorderComponent implements AfterViewInit {
    @ViewChild('videoElement') videoElementRef!: ElementRef;
    @ViewChild('slider') sliderElementRef!: ElementRef;

    mediaRecorder!: MediaRecorder;

    videoChunks: any [] = [];

    private bufferSize = 20; // for 2 second s

    ngAfterViewInit(): void {

        const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then((stream) => {
                    this.mediaRecorder = new MediaRecorder(stream);

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {


                            if (this.videoChunks.length > 2) {
                                let index = Number(this.sliderElementRef.nativeElement.value) === 0 ? 0 :
                                    (this.sliderElementRef.nativeElement.value - 2);

                                //videoElement.src = this.videoChunks[index];
                                videoElement.srcObject = event.data;
                            }

                            this.maintainBufferSize();
                            this.videoChunks.push(event.data);
                        }
                    };

                    this.mediaRecorder.start(10000); // Send data every 100ms

                })
                .catch((error) => {
                    console.error('Error accessing the camera:', error);
                });
        }


        // setInterval(() => {
        //     console.log(this.counter);
        //     this.counter = 0;
        // }, 1000);
    }

    private maintainBufferSize(): void {
        // Ensure we only keep the last 10 seconds of video
        const chunksPerSecond = 1; // Assuming 1 chunk per second for simplicity
        while (this.videoChunks.length > this.bufferSize * chunksPerSecond) {
            this.videoChunks.shift(); // Remove the oldest chunk
        }
    }

}
