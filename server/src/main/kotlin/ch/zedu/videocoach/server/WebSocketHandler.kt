package ch.zedu.videocoach.server

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.io.File
import java.io.FileOutputStream
import java.nio.channels.FileChannel
import java.nio.file.StandardOpenOption


class WebSocketHandler : BinaryWebSocketHandler() {
    private lateinit var fileChannel: FileChannel


    private lateinit var outputStream: FileOutputStream
    private val streamFileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264"
    private val mp4FileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.mp4"

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val videoFile = File(streamFileBasolutePath)
        videoFile.createNewFile() // if file already exists will do nothing

        super.afterConnectionEstablished(session)
        fileChannel = FileChannel.open(videoFile.toPath(), StandardOpenOption.WRITE)
    }


    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        val data = message.payload
        fileChannel.write(data)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        fileChannel.close()
        convertH264ToMp4(streamFileBasolutePath, mp4FileBasolutePath)
    }

    override fun supportsPartialMessages(): Boolean {
        return true
    }

    fun convertH264ToMp4(inputFilePath: String, outputFilePath: String) {
        val command = "ffmpeg -i $inputFilePath -c copy $outputFilePath"
        val processBuilder = ProcessBuilder(command.split(" "))
        processBuilder.redirectErrorStream(true)
        val process = processBuilder.start()

        // You can optionally read the output of the FFmpeg process if needed
        // val output = process.inputStream.bufferedReader().readText()

        // Wait for the process to complete
        process.waitFor()
    }

//    private fun processVideoStream(payload: ByteBuffer) {
//        // Parameters for video stream
//        val width = 640  // example width
//        val height = 480 // example height
//
//        // HLS segmenter configuration
//        val segmentLength = 10 // in seconds
//        val segmenter = FFmpegFrameRecorder("path/to/output.m3u8", width, height).apply {
//            format = "hls"
//            videoCodec = AV_CODEC_ID_H264
//            frameRate = 30.0 // example frame rate
//            gopSize = frameRate.toInt() * 2 // Group of Pictures (GOP) size
//            videoBitrate = 1000000 // example bitrate
//
//            // HLS-specific options
//            setOption("hls_time", segmentLength.toString())
//            setOption("hls_list_size", "0") // No limit on the number of segments in the playlist
//            setOption("hls_flags", "delete_segments+append_list") // Delete segments older than the playlist
//        }
//
//        try {
//            segmenter.start()
//
//            // Assuming payload is a raw video frame. Convert and process it.
//            // The conversion depends on your video format.
//            val frame = ... // Convert ByteBuffer to Frame
//            segmenter.record(frame)
//
//        } catch (e: Exception) {
//            e.printStackTrace()
//            // Handle exceptions
//        } finally {
//            segmenter.stop()
//            segmenter.release()
//        }
//    }

}
