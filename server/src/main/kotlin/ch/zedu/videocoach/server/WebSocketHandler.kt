package ch.zedu.videocoach.server

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.AbstractWebSocketHandler
import java.io.FileOutputStream

class WebSocketHandler : AbstractWebSocketHandler() {
    private val outputStream = FileOutputStream("video.h264")

    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        val data = message.payload.array()
        outputStream.write(data)
        outputStream.flush()
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        outputStream.close()
        // Start FFmpeg process to generate HLS playlist here...
    }
}
