//package ch.zedu.videocoach.server
//
//import org.springframework.http.HttpHeaders
//import org.springframework.http.MediaType
//import org.springframework.http.ResponseEntity
//import org.springframework.web.bind.annotation.CrossOrigin
//import org.springframework.web.bind.annotation.GetMapping
//import org.springframework.web.bind.annotation.RequestParam
//import org.springframework.web.bind.annotation.RestController
//import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
//import java.io.*
//
//
//@RestController
//class VideoController {
//    @GetMapping("/stream")
//    @CrossOrigin
//    fun streamVideo(@RequestParam filename: String): ResponseEntity<StreamingResponseBody> {
//
//        val videoFile = File("/path/to/your/$filename")
//        val headers = HttpHeaders()
//        headers.contentType = MediaType.APPLICATION_OCTET_STREAM
//        headers.setContentDispositionFormData("attachment", "$filename")
//        val responseBody = StreamingResponseBody { outputStream: OutputStream ->
//            try {
//                FileInputStream(videoFile).use { inputStream ->
//                    val buffer = ByteArray(256) // Buffer size can be adjusted
//                    var bytesRead: Int
//                    while (inputStream.read(buffer).also { bytesRead = it } != -1) {
//                        outputStream.write(buffer, 0, bytesRead)
//                        outputStream.flush() // Flush the output stream to send the data immediately
//                    }
//                }
//            } catch (e: IOException) {
//                // Handle exception
//            }
//        }
//        return ResponseEntity.ok()
//            .headers(headers)
//            .body<StreamingResponseBody>(responseBody)
//    }
//}
