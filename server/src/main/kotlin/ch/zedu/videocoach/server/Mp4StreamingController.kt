package ch.zedu.videocoach.server

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.Resource
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono


@RestController
class Mp4StreamingController(
    @Autowired
    private val service: Mp4StreamingService
) {
    @GetMapping(value = ["streammp4/{title}"], produces = ["video/mp4"])
    fun getVideo(@PathVariable title: String?, @RequestHeader("Range") range: String?): Mono<Resource> {
        println(range)
        return service.getVideo(title)
    }
}

