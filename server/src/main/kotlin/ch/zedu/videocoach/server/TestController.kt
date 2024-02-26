package ch.zedu.videocoach.server

import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController() {
    @GetMapping(value = ["test"])
    fun streamVideo(): String {
        return "test"
    }
}
