document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('videoElement');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    let mediaStream = null;
    let mediaRecorder = null;
    let socket = null;

    startButton.addEventListener('click', startStreaming);
    stopButton.addEventListener('click', stopRecording);

    function startStreaming() {
        try {
            if (!socket || socket.readyState === WebSocket.CLOSED) {
                socket = new WebSocket('wss://192.168.43.30:8443/video'); // for java server
                //socket = new WebSocket('ws://localhost:8080'); // for node server
            }

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                let constraints = { video: { facingMode: "environment" } };

                navigator.mediaDevices.getUserMedia(constraints)
                    .then((stream) => {
                        mediaStream = stream;
                        videoElement.srcObject = mediaStream;
                        mediaRecorder = new MediaRecorder(mediaStream);
                        socket.binaryType = 'arraybuffer';

                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                                socket.send(event.data);
                            }
                        };

                        mediaRecorder.start(100); // Send data every 100ms

                        socket.onerror = (error) => {
                            console.error('WebSocket Error:', error);
                        };
                        socket.onclose = function (msg) {
                            console.log("On Close = " + msg);
                        }

                        socket.onmessage = (event) => {
                            console.log('onmessage', event)
                            // Handle received messages here
                        };
                    })
                    .catch((error) => {
                        alert('Error accessing the camera:' + error);
                        console.error('Error accessing the camera:', error);
                    });
            }
        } catch (e) {
            alert(e);
        }
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        if (socket) {
            socket.close();
        }
    }
});
