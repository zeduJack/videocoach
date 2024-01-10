package ch.zedu.videocoach.server

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.nio.channels.FileChannel
import java.nio.file.StandardOpenOption


class WebSocketHandler : BinaryWebSocketHandler() {

    private var ffmpegProcess: Process? = null
    private var ffmpegInput: OutputStream? = null

    private lateinit var fileChannel: FileChannel


    private lateinit var outputStream: FileOutputStream
    private val streamFileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264"
    private val mp4FileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.mp4"

    override fun afterConnectionEstablished(session: WebSocketSession) {

        val processBuilder = ProcessBuilder(
            "ffmpeg",
            "-i", "-",  // '-' means reading from stdin
            "-c:v", "copy",  // Copy video codec
            "-c:a", "aac",  // Convert audio to AAC
            "-f", "hls",  // HLS format
            "-hls_time", "3",  // Segment length in seconds
            "-hls_list_size", "200",  // Number of segments to keep in the playlist
            "-hls_flags", "delete_segments",  // Delete old segments
            "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/hls/stream.m3u8"
        )

        try {
            ffmpegProcess = processBuilder.start()
            ffmpegInput = ffmpegProcess!!.outputStream
        } catch (e: IOException) {
            e.printStackTrace()
        }

//        val videoFile = File(streamFileBasolutePath)
//        videoFile.createNewFile() // if file already exists will do nothing
//
//        super.afterConnectionEstablished(session)
//        fileChannel = FileChannel.open(videoFile.toPath(), StandardOpenOption.WRITE)
    }


    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        val payload = message.payload
        if (ffmpegInput != null) {
            try {
                val data = ByteArray(payload.remaining())
                payload.get(data)
                ffmpegInput!!.write(data)
                ffmpegInput!!.flush()
            } catch (e: IOException) {
                e.printStackTrace()
                // Handle IOException (e.g., FFmpeg process ended unexpectedly)
            }
        }


//        fileChannel.write(payload)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
//        fileChannel.close()
//        convertH264ToMp4(streamFileBasolutePath, mp4FileBasolutePath)
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

}
