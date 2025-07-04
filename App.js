const express = require('express');
const app = express();
const port = 3000;
const path = require('path'); // to handle file paths

const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app); // create an http server using express app
const io = socketio(server); // attach socket.io to the server

//middleware 
app.use(express.static(path.join(__dirname ,'Public'))); // serve static files from the public directory
app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); // set the views directory

// handle socket connections
io.on('connection', (socket)=>{
    socket.on('sendLocation', (data)=>{
        io.emit('receivedLocation', { id: socket.id, ...data
        });
        console.log(`✅✅ New connection✅✅ : {Latitude, Longitude} : {${data.latitude}, ${data.longitude}}`);
    });
    socket.on('disconnect', ()=>{
        io.emit("user-disconnected", socket.id);
        console.log('❌❌ User disconnected ❌❌'); 
    });
});

// handle disconnection

app.get('/', (req, res) => {
    res.render('index'); // render the index.ejs file
})

server.listen(port, ()=>{ 
    // console.log(`Server is running on http://localhost:${port}`); 
});

//  To start the server : npx nodemon App.js