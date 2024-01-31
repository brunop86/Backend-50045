const socket = io();

socket.emit("mensaje", "Hello World cliente");
