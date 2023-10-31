package ch.zedu.videocoach.server

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.BinaryWebSocketHandler
import java.io.FileOutputStream

class WebSocketHandler : BinaryWebSocketHandler() {
    private lateinit var outputStream: FileOutputStream
    override fun afterConnectionEstablished(session: WebSocketSession) {
        super.afterConnectionEstablished(session)
        outputStream = FileOutputStream("/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264")
    }


    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        val data = message.payload.array()
        outputStream.write(data)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        outputStream.close()
        // Convert video.h264 to output.mp4 using FFmpeg here...
    }

    override fun supportsPartialMessages(): Boolean {
        return true
    }
}
