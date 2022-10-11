# api-rendr

API implementation on the fly. Quick and flexible definitions for express.

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

Use full-power with complex and mixed definitions.

```javascript
const { Render } = require("api-rendr");
const app = require("express")();

app.use(new Render().render({
    // [1] Define a handler fn for a "{METHOD} {/route}"
    "GET /": (req, res) => res.send("Try endpoint /orders"),
    // [2] Complex definition (object) for a {/route}
    "/orders": {
        // [3] Define a handler fn for a "{METHOD}" of a parent "{/route}"
        POST: (req, res) => res.send("/orders POST handler"),
        GET: (req, res) => res.send("/orders GET handler"),
        // Complex definition (object) for {/route/subroute}
        "/:ordId": {
            // Combine mixed definitions
            GET: (req, res) => res.send(`GET order ${req.params.ordId}`),
            "GET /status": "DONE",
            "/items": {
                // [4] Definition with an Array[] of handler fns
                GET: [
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - first handler...`); next(); },
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - second handler...`); next(); },
                    (req, res, next) => { res.send(`GET items of order ${req.params.ordId} - third and last handler.`) },
                ],
                "/detail": {
                    // [5] Implement a simple response with a fixed string
                    GET: "Not implemented yet!"
                }
            }
        }
    },
    "ALL /help     ": "This is the help to show...",
    // [6] Serve static resources
    "/resources": express.static(__dirname + "/static"),
}));

app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders/1234/items/detail`));
```

# `Render` class

This is the one and only, you need to instantiate it.
```javascript
const { Render } = require("api-rendr");
```

## Methods

### `constructor([options])`

Same options as for [express.Router()](https://expressjs.com/es/4x/api.html#router) constructor described [here](https://expressjs.com/es/4x/api.html#express.router).
```javascript
const r = new Render();
```

### `render(APIEndpointsSettings)`

Receives an `APIEndpointsSettings` descriptor object. Returns an [express.Router()](https://expressjs.com/es/4x/api.html#router) to be used by express app.
```javascript
app.use(r.render(oAPIEndpoints));
```

# The `APIEndpointsSettings` object.

Each **key** in this object, may be either:
 + an HTTP Method (see [Allowed HTTP methods](#allowed-http-methods)), 
 + [a path](https://expressjs.com/es/4x/api.html#path-examples) for a route 
 + or both. 

The corresponding value for that key should be the handler for that request -in a Simple definition- (see [Types of Handlers](#types-of-handlers)) or an object -Complex definition-.

## Types of Handlers

There are **four types** of handlers that can be applied to a route.

### 1. Handler function

Standard express handler fn.

```javascript
// Handle request by function
"GET /": (req, res) => { ... },
```

### 2. Fixed string

A String as the response. The response will be a HTTP 200 OK Content-type=text/plain.

```javascript
// Serve a String
"GET /version": "This is MyAPI " + myApi.getVersion(),
```

### 3. Static content

A [express.static()](https://expressjs.com/es/4x/api.html#express.static) to serve static resources for a specific route.

**Note:** you should not declare the method for the route when using express.static().

```javascript
// Serve static resources
"/resources": express.static(__dirname + "/static"),
```

### 4. Array of handler functions

An array of [handler functions](#handler-function).

```javascript
// Serve static resources
"GET /items": [
    (req, res, next) => { console.log(`GET items - first handler...`); next(); },
    (req, res, next) => { console.log(`GET items - second handler...`); next(); },
    (req, res, next) => { res.send(`GET items - third and last handler.`) },
],
```

## Posible combinations

Eigth base combinations.
```
"{METHOD} {/route}" + handler for Simple definitions

    (a) "{METHOD} {/route}" + handler fn
    (b) "{METHOD} {/route}" + fixed string
    (c) "{METHOD} {/route}" + Array[] of handler fns


"{/route}" for static resources

    (d) "{/route}" + express.static(...),


"{/route}" + object for Complex definition

    (e) "{/route}": {
            (f) "{METHOD}" + handler fn
            (g) "{METHOD}" + fixed string
            (h) "{METHOD}" + Array[] of handler fns
    }
```

And the combinations of all above
```
    "{/route}": {
            "{METHOD}" + handler fn
            "{METHOD}" + fixed string
            "{METHOD}" + Array[] of handler fns
            "{/subroute}" + express.static(...)
            "{/subroute}": {
                ...
            }
            "{METHOD} {/subroute}" + handler fn
            "{METHOD} {/subroute}" + fixed string
            "{METHOD} {/subroute}" + Array[] of handler fns
        }
```

## Allowed HTTP methods

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

# Usage

See examples in [examples](https://github.com/cape-/api-rendr/tree/master/examples).

# Author

Lautaro Capella <laucape@gmail.com>

# License 

GNU General Public License, version 2
