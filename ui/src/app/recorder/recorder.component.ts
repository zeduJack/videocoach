import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-recorder',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recorder.component.html',
    styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements AfterViewInit {
    @ViewChild('videoElement') videoElementRef!: ElementRef;
    // mediaRecorder!: MediaRecorder;

    ngAfterViewInit(): void {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then((mediaStream) => {
                    const socket = new WebSocket('ws://localhost:8080/video');

                    socket.binaryType = 'arraybuffer';

                    socket.onopen = () => {
                         const mediaRecorder = new MediaRecorder(mediaStream);

                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                                socket.send(event.data);
                            }
                        };

                        mediaRecorder.start(1000); // mediaRecorder.ondataavailable is only invoked if this is set
                        // this.mediaRecorder.start();
                    };

                    socket.onerror = (error) => {
                        console.error('WebSocket Error:', error);
                    };
                })
                .catch((error) => {
                    console.error('Error accessing the camera:', error);
                });
        }

        // setTimeout(() => {
        //     this.mediaRecorder.stop();
        // }, 5000)

        // setTimeout(() => this.mediaRecorder.requestData(), 1000)
    }
}
