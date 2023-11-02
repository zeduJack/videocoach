import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferFactory
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import java.io.IOException
import java.io.RandomAccessFile
import java.nio.ByteBuffer

@RestController
class BufferStreamingController {

    private val videoFilePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264"

    @GetMapping(value = ["buffer/{title}"])
    fun streamVideo(response: ServerHttpResponse): Flux<DataBuffer> {
        response.headers.contentType = MediaType.APPLICATION_OCTET_STREAM
        response.headers.set("Accept-Ranges", "bytes")

        return readVideoFileReactively()
    }

    private fun readVideoFileReactively(): Flux<DataBuffer> {
        try {
            val file = RandomAccessFile(videoFilePath, "r")
            val fileChannel = file.channel

            return Flux.generate<DataBuffer> {
                val buffer = ByteBuffer.allocate(4096) // Adjust buffer size as needed
                val bytesRead: Int
                try {
                    bytesRead = fileChannel.read(buffer)
                } catch (e: IOException) {
                    it.error(e)
                    return@generate
                }
                if (bytesRead == -1) {
                    it.complete()
                } else {
                    buffer.flip()
                    val dataBufferFactory = it.currentContext().get<DataBufferFactory>(DataBufferFactory::class.java)
                    val dataBuffer = dataBufferFactory.wrap(buffer)
                    it.next(dataBuffer)
                }
            }.doFinally {
                try {
                    fileChannel.close()
                    file.close()
                } catch (e: IOException) {
                    // Handle exception if necessary
                }
            }
        } catch (e: IOException) {
            return Flux.error(e) // Handle the exception accordingly
        }
    }
}
