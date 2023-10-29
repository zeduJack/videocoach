import {Routes} from '@angular/router';
import {CameraComponent} from "./camera/camera.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "camera",
        pathMatch: "full"
    },
    {
        path: "camera",
        component: CameraComponent
    }
];
