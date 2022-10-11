# api-rendr

API implementation on the fly. Provides hooks for validations, transformations, and triggering other actions.

This module uses [express](https://expressjs.com).

# Intuitive and simple

Straight forward, human friendly.

```javascript
const { Render } = require("api-rendr");
const app = require("express")();

const r = new Render();
const oAPIEndpoints = {
    "ALL  /                   ": (req, res) => res.send("Try endpoint /orders"),
    "POST /orders             ": (req, res) => res.send("/orders POST handler"),
    "GET  /orders             ": (req, res) => res.send("/orders GET handler"),
    "GET  /orders/:ordId      ": (req, res) => res.send(`GET order ${req.params.ordId}`),
    "GET  /orders/:ordId/items": (req, res) => res.send(`GET items of order ${req.params.ordId}`)
}

app.use(r.render(oAPIEndpoints));
app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders/1234/items`));
```

# Yet versatile

Use full-power complex or even mixed definitions.

```javascript
const { Render } = require("../main");
const app = require("express")();

app.use(new Render().render({
    // Define a handler fn for a "{METHOD} {/route}"
    "GET /": (req, res) => res.send("Try endpoint /orders"),
    // Define a object for {/route}
    "/orders": {
        // Define a handler fn for a "{METHOD}"
        POST: (req, res) => res.send("/orders POST handler"),
        GET: (req, res) => res.send("/orders GET handler"),
        // Define a object for {/route/subroute}
        "/:ordId": {
            // Use mixed definitions
            GET: (req, res) => res.send(`GET order ${req.params.ordId}`),
            "GET /status": "DONE",
            "/items": {
                // Define an Array of handler fns
                GET: [
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - first handler...`); next(); },
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - second handler...`); next(); },
                    (req, res, next) => { res.send(`GET items of order ${req.params.ordId} - third and last handler.`) },
                ],
                "/detail": {
                    // Serve a simple response with a fixed string
                    GET: "Not implemented yet!"
                }
            }
        }
    },
    "ALL /help     ": "This is the help to show...",
    // Serve static resources
    "/resources": express.static(__dirname + "/static"),
}));

app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders/1234/items/detail`));
```

# `Render` class

## Methods

### `constructor([options])`

Same options as for [express.Router()](https://expressjs.com/es/4x/api.html#router) constructor described [here](https://expressjs.com/es/4x/api.html#express.router).

### `render(APIEndpointsSettings)`

Receives an `APIEndpointsSettings` descriptor object. Returns an [express.Router()](https://expressjs.com/es/4x/api.html#router) to be used by express app.

## The `APIEndpointsSettings` object.

Each key of this object, must consist of a string containing the HTTP Method (see [Allowed HTTP methods](#allowed-http-methods)) followed by [a path](https://expressjs.com/es/4x/api.html#path-examples). The corresponding value for the key should be the handler for that request (see [Types of Handlers](#types-of-handlers)).

### Allowed HTTP methods

These are the [methods allowed by express](https://expressjs.com/es/4x/api.html#routing-methods):

 + checkout
 + copy
 + delete
 + get
 + head
 + lock
 + merge
 + mkactivity
 + mkcol
 + move
 + m-search
 + notify
 + options
 + patch
 + post
 + purge
 + put
 + report
 + search
 + subscribe
 + trace
 + unlock
 + unsubscribe

 Also allowed express [`all method`](https://expressjs.com/es/4x/api.html#router.all) as valid method.

 Method parsing is **case-insensitive** and doesn't care of **multiple blanks**, so you can use "regular" uppercase style for HTTP methods descriptors and align paths as you like.
 
 ```javascript
    "GET    /users      ": () => {},
    "POST   /users      ": () => {},
    "DELETE /users      ": () => {},
    "ALL    /accessToken": () => {}
 ```

### Types of Handlers

There are **four types** of handlers that can be applied to a route.

#### Handler function

Standard express handler fn.

```javascript
// Handle request by function
"GET /": (req, res) => { ... },
```

#### String

A String as the response. The response will be a HTTP 200 OK Content-type=text/plain.

```javascript
// Serve a String
"GET /version": "This is MyAPI v1.2.0",
```

#### Static content

A [express.static()](https://expressjs.com/es/4x/api.html#express.static) to serve static resources for a specific route.

**Note:** you should not declare the method for the route when using express.static().

```javascript
// Serve static resources
"/resources": express.static(__dirname + "/static"),
```

#### Array of handler functions

An array of [handler functions](#handler-function).

```javascript
// Serve static resources
"GET /items": [
    (req, res, next) => { console.log(`GET items - first handler...`); next(); },
    (req, res, next) => { console.log(`GET items - second handler...`); next(); },
    (req, res, next) => { res.send(`GET items - third and last handler.`) },
],
```

# Author

Lautaro Capella <laucape@gmail.com>

# License 

GNU General Public License, version 2
