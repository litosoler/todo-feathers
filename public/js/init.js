// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const feathersApp = feathers();

feathersApp.configure(feathers.socketio(socket));
// Use localStorage to store our login token
feathersApp.configure(feathers.authentication({
  storage: window.localStorage
}));