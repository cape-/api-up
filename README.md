# api-rendr

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![npm version](https://badge.fury.io/js/api-rendr.svg)](https://badge.fury.io/js/api-rendr)

> 🚀 Lightning-fast API implementation for Express.js with an intuitive, human-friendly syntax.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Simple Definition](#simple-definition)
  - [Complex Definition](#complex-definition)
- [API Reference](#api-reference)
  - [Render Class](#render-class)
  - [Endpoint Definitions](#endpoint-definitions)
  - [Handler Types](#handler-types)
- [Advanced Usage](#advanced-usage)
- [HTTP Methods Support](#http-methods-support)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Simple & Intuitive**: Human-readable API definitions
🔌 **Express.js Power**: Built on top of Express.js, maintaining all its capabilities
🛠️ **Flexible Definitions**: Support for both simple and complex endpoint structures
⚡ **Zero Configuration**: Works out of the box with sensible defaults
🔄 **Middleware Support**: Chain multiple handlers effortlessly
📁 **Static File Serving**: Built-in support for serving static content

## Installation

```bash
npm install api-rendr
```

## Quick Start

```javascript
const { Render } = require("api-rendr");
const app = require("express")();

const r = new Render();
const apiEndpoints = {
    "GET  /": (req, res) => res.send("Welcome to my API"),
    "POST /users": (req, res) => res.send("Create user"),
    "GET  /users/:id": (req, res) => res.send(`Get user ${req.params.id}`)
};

app.use(r.render(apiEndpoints));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

## Usage Examples

### Simple Definition

Perfect for straightforward API implementations:

```javascript
const apiEndpoints = {
    "ALL  /                   ": (req, res) => res.send("API Home"),
    "POST /orders             ": (req, res) => res.send("Create order"),
    "GET  /orders             ": (req, res) => res.send("List orders"),
    "GET  /orders/:ordId      ": (req, res) => res.send(`Get order ${req.params.ordId}`),
    "GET  /orders/:ordId/items": (req, res) => res.send(`Get items for order ${req.params.ordId}`)
}
```

### Complex Definition

For more sophisticated API structures:

```javascript
const apiEndpoints = {
    "/orders": {
        GET: (req, res) => res.send("List orders"),
        POST: (req, res) => res.send("Create order"),
        "/:ordId": {
            GET: (req, res) => res.send(`Get order ${req.params.ordId}`),
            "GET /status": "DONE",
            "/items": {
                GET: [
                    (req, res, next) => { console.log("Validation middleware"); next(); },
                    (req, res) => res.send("Order items")
                ]
            }
        }
    },
    "/static": express.static(__dirname + "/public")
}
```

## API Reference

### Render Class

The main class for creating API endpoints:

```javascript
const r = new Render([options]); // options are passed to express.Router()
app.use(r.render(apiEndpoints));
```

### Endpoint Definitions

Eight base combinations are supported:

1. Simple definitions:
   - `"{METHOD} {/route}"` + handler function
   - `"{METHOD} {/route}"` + fixed string
   - `"{METHOD} {/route}"` + handler array

2. Static resources:
   - `"{/route}"` + express.static()

3. Complex definitions:
   - `"{/route}"` + nested object with methods
   - Nested routes with their own handlers
   - Mixed definitions within objects

### Handler Types

1. **Function Handler**
```javascript
"GET /users": (req, res) => { /* handler logic */ }
```

2. **Fixed String Response**
```javascript
"GET /version": "API v1.0.0"
```

3. **Static Content**
```javascript
"/public": express.static(__dirname + "/static")
```

4. **Handler Array (Middleware Chain)**
```javascript
"GET /protected": [
    authMiddleware,
    validateRequest,
    (req, res) => res.send("Protected content")
]
```

## Advanced Usage

### Middleware Chains
```javascript
{
    "GET /secure": [
        (req, res, next) => { /* auth check */ },
        (req, res, next) => { /* validation */ },
        (req, res) => { /* final handler */ }
    ]
}
```

### Dynamic Responses
```javascript
{
    "GET /status": (req, res) => {
        const status = calculateStatus();
        res.json({ status, timestamp: new Date() });
    }
}
```

### Route Parameters
```javascript
{
    "GET /users/:userId/posts/:postId": (req, res) => {
        const { userId, postId } = req.params;
        // Handle request
    }
}
```

## HTTP Methods Support

Supports all Express.js methods (case-insensitive):
- GET, POST, PUT, DELETE, PATCH
- HEAD, OPTIONS
- TRACE, CONNECT
- And more...

Special method `ALL` handles any HTTP method.

## Best Practices

1. **Route Organization**
   - Group related endpoints under common paths
   - Use meaningful route names
   - Keep nesting levels manageable

2. **Handler Implementation**
   - Use middleware for cross-cutting concerns
   - Keep handlers focused and single-purpose
   - Implement proper error handling

3. **Code Structure**
   - Separate route definitions from handlers
   - Use constants for fixed strings
   - Document complex endpoints

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE) file for details.

## Author

Lautaro Capella <laucape@gmail.com>

---

Made with ❤️ by the api-rendr team