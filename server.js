'use strict';

const express = require('express');
const SocketServer = require('ws').Server;

const PORT = process.env.PORT || 3000;

const app = express()
  .use((req, res) => res.redirect('https://github.com/casey/floodhub'))
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
      console.warn(`Malformed JSON from client ${id}: ${e}: ${msg}`)
    }
    parsed.from = id;

    var out = JSON.stringify(parsed);

    if (parsed.to == 'all') {
      sockets.forEach(function (socket) {
        socket.send(out);
      });
    } else if (sockets.has(parsed.to)) {
      sockets[parsed.to].send(out);
    } else {
      console.warn(`Unknown recipient: ${msg}`);
    }
  });

  ws.on('close', function() { 
    delete socket[id];
  });
});
