package ch.zedu.videocoach.server

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.io.File
import java.io.FileOutputStream


class WebSocketHandler : BinaryWebSocketHandler() {
    private lateinit var outputStream: FileOutputStream
    private val streamFileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264"
    private val mp4FileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.mp4"

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val videoFile = File(streamFileBasolutePath)
        videoFile.createNewFile() // if file already exists will do nothing

        super.afterConnectionEstablished(session)
        outputStream = FileOutputStream(videoFile)
    }


    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        val data = message.payload.array()
        outputStream.write(data)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        outputStream.close()
        // Convert video.h264 to output.mp4 using FFmpeg here...

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
}
