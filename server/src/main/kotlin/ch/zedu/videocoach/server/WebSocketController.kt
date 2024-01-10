package ch.zedu.videocoach.server

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import java.io.FileInputStream
import java.io.IOException

@Controller
class WebSocketController {

    private val hlsOutputPath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/hls"
    private val streamFileBasolutePath = "/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/video.h264"

    private val continuousStreamConverter = ContinuousStreamConverter()

    @MessageMapping("/subscribe/video")
    @SendTo("/topic/video")
    fun subscribeVideo(): String {
        return "Connected to video stream."
    }


    @RequestMapping("/starthls")
    @CrossOrigin
    fun streamVideo() {
        continuousStreamConverter.convertContinuousStream(streamFileBasolutePath, hlsOutputPath)
    }

}
