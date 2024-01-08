package ch.zedu.videocoach.server

import java.io.IOException


class ContinuousStreamConverter {
    fun convertContinuousStream(inputFilePath: String?, outputDirectory: String) {
        val processBuilder = ProcessBuilder(
            "ffmpeg",
            "-re",
            "-i", inputFilePath,
            "-c:v", "copy",  // Copy the video codec as it's already H.264
            "-c:a", "aac",  // Convert audio to AAC
            "-f", "hls",  // HLS format
            "-hls_time", "6",  // Segment length in seconds
            "-hls_list_size", "10",  // Number of segments to include in the playlist
            "-hls_flags", "delete_segments+append_list",  // Delete old segments and append to the list
            "$outputDirectory/stream.m3u8"
        )
        try {
            val process = processBuilder.start()
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("FFmpeg exited with error code: $exitCode")
            }
        } catch (e: IOException) {
            e.printStackTrace()
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
    }

    fun main() {
        val inputFilePath = "/path/to/your/growing/h264/stream" // Path to the growing H.264 stream file
        val outputDirectory = "/path/to/output/directory" // Path to the output directory for HLS
        convertContinuousStream(inputFilePath, outputDirectory)
    }
}
