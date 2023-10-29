import {Routes} from '@angular/router';
import {CameraComponent} from "./camera/camera.component";
import {RecorderComponent} from "./recorder/recorder.component";

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
    }
];
