const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const wss = new WebSocket.Server({ port: 8080 });
const stream = new PassThrough();

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        stream.push(message); // Push the message buffer to the PassThrough stream
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        stream.end(); // End the stream when the client disconnects
    });
});

// Initialize FFmpeg with the PassThrough stream as input
ffmpeg(stream)
    .format('hls')
    .outputOptions([
        '-hls_time 3',        // Segment length in seconds
        // '-hls_list_size 6',    // Number of segments to keep in the playlist
        // '-hls_flags delete_segments', // Delete old segments
        '-c:v copy',           // Copy video codec (assuming the incoming stream is compatible)
        '-c:a aac'             // Re-encode audio to AAC
    ])
    .on('error', (err) => {
        console.error('Error:', err.message);
    })
    .on('end', () => {
        console.log('Processing finished');
    })
    .save('/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/hls/stream.m3u8');

console.log('WebSocket server started on port 8080');
