//Initialize the express 'app' object
let express = require('express');
let app = express();

app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io')(server);
let instrument1 = io.of('/instrument1');
let instrument2 = io.of('/instrument2');

//Listen for individual clients/users to connect
instrument1.on('connection', function(socket) {
    console.log("We have a new instrument 1: " + socket.id);
   

    //Listen for a message named 'data' from this client

    
    socket.on('data', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received: 'data' " + data);

        //Send the data to all clients, including this one
        //Set the name of the message to be 'data'
        instrument1.emit('data', data);
        instrument2.emit('other',data);
       

        //Send the data to all other clients, not including this one
        // socket.broadcast.emit('data', data);

        //Send the data to just this client
        // socket.emit('data', data);
    });

});


instrument2.on('connection', function(socket) {
    console.log("We have a new instrument 2: " + socket.id);

    //Listen for a message named 'data' from this client

    
    socket.on('data', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received: 'data' " + data);

        //Send the data to all clients, including this one
        //Set the name of the message to be 'data'
        instrument2.emit('data', data);
        instrument1.emit('other',data);
       

        //Send the data to all other clients, not including this one
        // socket.broadcast.emit('data', data);

        //Send the data to just this client
        // socket.emit('data', data);
    });

});