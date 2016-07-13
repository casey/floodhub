'use strict';

const express = require('express');
const SocketServer = require('ws').Server;

const PORT = process.env.PORT || 3000;

const app = express()
  .use((req, res) => { console.log('Serving redirect'); res.redirect('https://github.com/casey/floodhub'); })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({server: app});

var nextID = 0;
var sockets = new Map();

wss.on('connection', (ws) => {
  var id = nextID++;
  sockets[id] = ws;

  ws.on('message', function(msg) {
    var parsed;
    try {
      parsed = JSON.parse(msg);
    } catch(e) {
      console.warn(`Malformed JSON from client ${id}: ${e}: ${msg}`);
      return;
    }
    console.log(`Received message from client ${id}: ${msg}`);
    parsed.from = id;

    var out = JSON.stringify(parsed);

    if (parsed.to == 'all') {
      console.log(`Forwarding to all clients`);
      sockets.forEach(function (socket) {
        socket.send(out);
      });
    } else if (sockets.has(parsed.to)) {
      console.log(`Forwarding to client ${id}`);
      sockets[parsed.to].send(out);
    } else {
      console.warn(`Unknown recipient: ${parsed.to}`);
    }
  });

  ws.on('close', function() { 
    console.log(`Socket ${id} closed`);
    delete sockets[id];
  });
});
