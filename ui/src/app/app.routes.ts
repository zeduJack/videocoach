import {Routes} from '@angular/router';
import {CameraComponent} from "./camera/camera.component";
import {RecorderComponent} from "./recorder/recorder.component";
import {HlsComponent} from "./hls/hls.component";
import {Mp4StreameViewerComponent} from "./mp4-streame-viewer/mp4-streame-viewer.component";
import {H264StreameViewerComponent} from "./h264-streame-viewer/h264-streame-viewer.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "camera",
        pathMatch: "full"
    },
    {
        path: "camera",
        component: CameraComponent
    },
    {
        path: "recorder",
        component: RecorderComponent
    },
    {
        path: "viewer",
        component: HlsComponent
    },
    {
        path: "mp4streamviewer",
        component: Mp4StreameViewerComponent
    },
    {
        path: "h264streamviewer",
        component: H264StreameViewerComponent
    },
    {
        path: "hls",
        component: HlsComponent
    }
];
