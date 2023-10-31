import {Routes} from '@angular/router';
import {CameraComponent} from "./camera/camera.component";
import {RecorderComponent} from "./recorder/recorder.component";
import {ViewerComponent} from "./viewer/viewer.component";

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
        component: ViewerComponent
    }
];
