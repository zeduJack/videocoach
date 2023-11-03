# Vorgehen
## Libraries / Protokolle
- WebRTC
- socket.io oder stomp

# Ui

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Serve for accessing from other devices in the network
Run `npx ng serve --ssl true --host 0.0.0.0 --disable-host-check`

### Update Angular Application to Listen on All Network Interfaces:
By default, the Angular development server only listens to localhost. You need to tell it to listen to all network interfaces so it can be accessed from your phone.
Add the `--host 0.0.0.0` flag when starting your Angular application.

### Ensure HTTPS (Secure Connection)
On most mobile devices, getUserMedia (which is used to access the camera) requires a secure context (HTTPS). Make sure your Angular application is served over HTTPS. You can achieve this by using a development proxy or configuring SSL for your local development server.

For example, using Angular CLI, you can run:
`ng serve --ssl true --host 0.0.0.0 --disable-host-check`

The `--ssl true` flag enables HTTPS, and --disable-host-check allows connections from any host.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
