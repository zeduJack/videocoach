package ch.zedu.videocoach.server

import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class H264StreamingService{
    fun getVideo(title: String?): Mono<Resource> {
        return Mono.fromSupplier {
            FileSystemResource("/Users/zeljkodujmovic/Workarea/videocoach/ui/src/assets/${title}.h264")
        }
    }
}

