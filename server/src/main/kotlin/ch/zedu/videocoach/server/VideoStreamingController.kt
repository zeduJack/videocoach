package ch.zedu.videocoach.server

import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.nio.file.Path
import java.nio.file.Paths
import java.util.concurrent.Executors

@Controller
@RequestMapping("/buffer")
class VideoStreamingController(private val messagingTemplate: SimpMessagingTemplate) {

    private val videoFilePath: Path = Paths.get("/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264") // Replace with your file path
    private val executor = Executors.newSingleThreadExecutor()

    @RequestMapping("/video")
    @ResponseBody
    @CrossOrigin
    fun streamVideo() {
        executor.execute {
            try {
                while (true) {
                    val fileInputStream = FileInputStream(videoFilePath.toFile())
                    fileInputStream.use { input ->
                        val buffer = ByteArray(1024)
                        var bytesRead: Int
                        while (input.read(buffer).also { bytesRead = it } != -1) {
                            messagingTemplate.convertAndSend("/topic/video", buffer.copyOf(bytesRead))
                        }
                    }
                    Thread.sleep(1000) // Adjust the sleep duration as needed
                }
            } catch (e: IOException) {
                e.printStackTrace()
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }
    }

}
