# api-rendr

API implementation on the fly. Provides hooks for validations, transformations, and triggering other actions

# Intuitive and Simple

```javascript
const { Render } = require("api-rendr");
const app = require("express")();

const r = new Render();
const oAPIEndpoints = {
    "ALL  /": (req, res) => res.send("Try navigating to <code>/orders.</code>"),
    "POST /orders": (req, res) => res.send("This is the /orders POST handler responding."),
    "GET  /orders": (req, res) => res.send("This is the /orders GET handler responding."),
    "GET  /orders/:orderId": (req, res) => res.send("This is the /orders/:orderId GET handler responding."),
    "GET  /orders/:orderId/items": (req, res) => res.send("This is the /orders/:orderId/items GET handler responding.")
}

app.use(r.render(oAPIEndpoints));
app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders`));

```

# Methods

## `.render()`

Receives an API Endpoints descriptor object. Returns an [express.Router()](https://expressjs.com/es/4x/api.html#router) to be used by express app.

# Author

Lautaro Capella <laucape@gmail.com>

# License 

GNU General Public License, version 2
