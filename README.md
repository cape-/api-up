# api-rendr

APIs implementation on the fly. Provides hooks for validations, transformations, and triggering other actions.

## Features

- Quick API setup with minimal code
- Support for all HTTP methods
- Nested routes
- TypeScript support
- Static file serving
- Multiple response types (functions, fixed strings, etc.)

## Installation

```bash
npm install api-rendr
```

## Usage

### TypeScript

```typescript
import express from 'express';
import { Render } from 'api-rendr';
import { APIEndpoints } from 'api-rendr/types';

const app = express();

// Define API endpoints
const endpoints: APIEndpoints = {
  "GET /": "Welcome to API-rendr!",
  "GET /hello": (req, res) => {
    res.send("Hello World!");
  },
  "/api": {
    "GET /status": "OK",
    "GET /version": "1.0.0"
  }
};

// Create and mount the API
const api = new Render().render(endpoints);
app.use(api);

app.listen(3000);
```

### JavaScript

```javascript
const express = require('express');
const { Render } = require('api-rendr');

const app = express();

// Define API endpoints
const endpoints = {
  "GET /": "Welcome to API-rendr!",
  "GET /hello": (req, res) => {
    res.send("Hello World!");
  },
  "/api": {
    "GET /status": "OK",
    "GET /version": "1.0.0"
  }
};

// Create and mount the API
const api = new Render().render(endpoints);
app.use(api);

app.listen(3000);
```

## Endpoint Definition

Endpoints can be defined in several ways:

1. Method and route: `"GET /path"`
2. Route only (defaults to GET): `"/path"`
3. Method only (applies to root path): `"POST"`

## Response Types

- Function handlers: `(req, res) => { ... }`
- Fixed strings: `"Hello World"`
- Array of handlers: `[(req, res, next) => { ... }, (req, res) => { ... }]`
- Nested routes: `{ "GET /": "Root", "GET /sub": "Sub" }`

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run examples
npm run Example
npm run ExampleMixed
```

## License

GPL-2.0