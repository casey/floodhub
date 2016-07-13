floodhub
--------

A simple websocket server.

Messages sent by clients should be JSON strings that deserialize to objects with the following fields:

`namespace`: The message namespace.
`data`:      The message payload.
`type`:      A string identifying the type of the message.
`to`:        A numeric ID will cause the message to be delivered
             to the client with that ID. The string "all" will
             cause the message to be delivered to all connected
             clients. An array of client IDs will cause the message
             to be delivered to just those clients.

The server will add a `from` field set to the numeric ID of the
originating client. The server assigns IDs to each client that
connects, starting at 0.

Namespaces are not handled specially by the server, and are
there so multiple apps can ignore each other's messages.

For example, the following message sent by client 0:
```
{
  "namespace": "something-cool",
  "type":      "hello",
  "data":      [1,2,3],
  "to":        "all"
}
```

Will be transmitted to all clients as:
```
{
  "namespace": "something-cool",
  "type":      "hello",
  "data":      [1,2,3],
  "to":        "all",
  "from":      0
}
```

The following message sent by client 1:
```
{
  "namespace": "something-cool",
  "type":      "goodbye",
  "data":      [1,2,3],
  "to":        [0,2,3]
}
```

Will be transmitted to clients 0, 2, and 3 as:
```
{
  "namespace": "something-cool",
  "type":      "goodbye",
  "data":      [1,2,3],
  "to":        [0, 2, 3],
  "from":      1
}
```
