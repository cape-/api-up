import express from 'express';
import { Render } from '../src/main';
import { APIEndpoints } from '../src/types';
import Debug from 'debug';

const debug = Debug('api-rendr:example');

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

// Start server
const port = 3000;
app.listen(port, () => {
  debug(`Server running at http://localhost:${port}`);
});