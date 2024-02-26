import {Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-recorder',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recorder.component.html',
    styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent {
    @ViewChild('videoElement') videoElementRef!: ElementRef;

    mediaStream!: MediaStream;

    mediaRecorder!: MediaRecorder;
    socket!: WebSocket;

    startStreaming(): void {
        try {
            if (!this.socket || this.socket?.readyState === WebSocket.CLOSED) {
                this.socket = new WebSocket('wss://localhost:8443/video'); // for java server
                //this.socket = new WebSocket('ws://localhost:8080'); // for node server
            }

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({video: true, audio: true})
                    .then((mediaStream) => {
                        this.mediaStream = mediaStream;
                        this.mediaRecorder = new MediaRecorder(mediaStream);
                        this.socket.binaryType = 'arraybuffer';

                        this.mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0 && this.socket.readyState === WebSocket.OPEN) {
                                this.socket.send(event.data);
                            }
                        };

                        this.mediaRecorder.start(100); // Send data every 100ms

                        this.socket.onerror = (error) => {
                            console.error('WebSocket Error:', error);
                        };
                        this.socket.onclose = function (msg) {
                            console.log("On Close = " + msg);
                        }

                        this.socket.onmessage = (event) => {
                            console.log('onmessage', event)
                            // Handle received messages here
                        };

                    })
                    .catch((error) => {
                        console.error('Error accessing the camera:', error);
                    });
            }
        } catch (e) {
            alert(e);
        }
    }

    protected readonly stop = stop;

    stopRecording() {
        this.mediaRecorder.stop();
        this.mediaStream.getTracks().forEach(function (track) {
            track.stop();
        });
        this.socket.close();
    }
}
