# api-rendr

API implementation on the fly. Provides hooks for validations, transformations, and triggering other actions

# Intuitive and simple

```javascript
const { Render } = require("api-rendr");
const app = require("express")();

const r = new Render();
const oAPIEndpoints = {
    "ALL  /": (req, res) => res.send("Try endpoint /orders"),
    "POST /orders": (req, res) => res.send("/orders POST handler"),
    "GET  /orders": (req, res) => res.send("/orders GET handler"),
    "GET  /orders/:orderId": (req, res) => res.send(`GET order ${req.params.orderId}`),
    "GET  /orders/:orderId/items": (req, res) => res.send(`GET items of order ${req.params.orderId}`)
}

app.use(r.render(oAPIEndpoints));
app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders`));
```

# `Render` class

## Methods

### `constructor([options])`

Same options as for [express.Router()](https://expressjs.com/es/4x/api.html#router) constructor described [here](https://expressjs.com/es/4x/api.html#express.router).

### `render(APIEndpointsSettings)`

Receives an `APIEndpointsSettings` descriptor object. Returns an [express.Router()](https://expressjs.com/es/4x/api.html#router) to be used by express app.

## The `APIEndpointsSettings` object.

Each key of this object, must consist of a string containing the HTTP Method followed by the route. The corresponding value should be the handler (`(req,res,next) => {}`) function for that request.

### HTTP methods [allowed by express](https://expressjs.com/es/4x/api.html#routing-methods):

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

 Also allowed express [`all`](https://expressjs.com/es/4x/api.html#router.all) method as valid method.

 Method parsing is **case-insensitive** and doesn't care of **multiple blanks**, so you can use "regular" uppercase style for HTTP methods descriptors.
 
 ```javascript
    "GET    /users      ": () => {},
    "POST   /users      ": () => {},
    "DELETE /users      ": () => {},
    "ALL    /accessToken": () => {}
 ```

# Author

Lautaro Capella <laucape@gmail.com>

# License 

GNU General Public License, version 2
