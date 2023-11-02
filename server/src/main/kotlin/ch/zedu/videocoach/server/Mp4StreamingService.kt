package ch.zedu.videocoach.server

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono


@Service
class Mp4StreamingService(
    @Autowired
    private val resourceLoader: ResourceLoader
) {
    fun getVideo(title: String?): Mono<Resource> {
        return Mono.fromSupplier {
            resourceLoader.getResource(
                String.format(FORMAT, title)
            )
        }
    }

    companion object {
        private const val FORMAT = "classpath:videos/%s.mp4"
    }
}
