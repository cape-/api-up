// Copyright (C) 2022 Lautaro Capella <laucape@gmail.com>
// 
// This file is part of API-rendr.
// 
// API-rendr is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// API-rendr is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with API-rendr.  If not, see <http://www.gnu.org/licenses/>.

import express, { Router, RequestHandler } from "express";
import Debug from "debug";

const debug = Debug("api-rendr:Render");

type HTTPMethod = 
  | "all" | "checkout" | "copy" | "delete" | "get" | "head" | "lock" | "merge"
  | "mkactivity" | "mkcol" | "move" | "m-search" | "notify" | "options" | "patch"
  | "post" | "purge" | "put" | "report" | "search" | "subscribe" | "trace"
  | "unlock" | "unsubscribe";

interface EndpointParseResult {
  method: HTTPMethod;
  route: string;
}

type EndpointValue = 
  | RequestHandler 
  | RequestHandler[] 
  | string 
  | Record<string, EndpointValue>;

interface APIEndpoints {
  [key: string]: EndpointValue;
}

interface RouterConfig {
  caseSensitive?: boolean;
  mergeParams?: boolean;
  strict?: boolean;
}

export class APIRenderRender {
  private _router: Router;

  constructor(config?: RouterConfig) {
    this._router = Router(config);
    return this;
  }

  render(apiEndpoints: APIEndpoints, mountPath?: string): Router {
    for (const endpointExpression in apiEndpoints) {
      const endpointValue = apiEndpoints[endpointExpression];
      const endpoint = this._parseEndpointExpression(endpointExpression, mountPath);

      if (typeof endpointValue === "function") {
        if (endpointValue.name === "serveStatic") {
          // express.static
          debug(`${endpointExpression} STATIC`);
          this._router.use(endpointExpression, endpointValue);
        } else {
          // handler fn
          debug(`${endpoint.method.toUpperCase()} ${endpoint.route} FN ${endpointValue.toString().substring(0, 40)}`);
          this._router[endpoint.method](endpoint.route, endpointValue);
        }
      } else if (Array.isArray(endpointValue)) {
        // Array of handlers [fn()]
        debug(`ROUTE ${endpoint.route} MULTI-HANDLERS (${endpointValue.length})`);
        endpointValue.forEach(handler => {
          if (typeof handler === "function") {
            // handler fn
            debug(`+ ${endpoint.method.toUpperCase()} ${endpoint.route} FN ${handler.toString().substring(0, 40)}`);
            this._router[endpoint.method](endpoint.route, handler);
          }
        });
      } else if (typeof endpointValue === "object") {
        // sub-route (recursive)
        debug(`ROUTE ${endpoint.route} (RECURSIVE)`);
        this.render(endpointValue as APIEndpoints, endpoint.route);
      } else if (typeof endpointValue === "string") {
        // fixed string
        debug(`${endpoint.method.toUpperCase()} ${endpoint.route} FIXED STRING ${endpointValue.substring(0, 40)}`);
        this._router[endpoint.method](endpoint.route, (req, res) => res.send(endpointValue));
      } else {
        throw new Error("Unexpected value for key in endpoint settings");
      }
    }
    return this._router;
  }

  private _parseEndpointExpression(endpointExpression: string, mountPath?: string): EndpointParseResult {
    const rMethodAndRoute = /^\s*(all|checkout|copy|delete|get|head|lock|merge|mkactivity|mkcol|move|m-search|notify|options|patch|post|purge|put|report|search|subscribe|trace|unlock|unsubscribe)\s+(\/\S*)\s*$/i;
    const rMethod = /^\s*(all|checkout|copy|delete|get|head|lock|merge|mkactivity|mkcol|move|m-search|notify|options|patch|post|purge|put|report|search|subscribe|trace|unlock|unsubscribe)\s*$/i;
    const rRoute = /^\s*(\/\S*)\s*$/;
    const _mountPath = (mountPath || "").trim();

    let stringParts: RegExpMatchArray | null;
    let method: HTTPMethod = "get"; // default method
    let route: string;

    try {
      // Try to parse as "METHOD /route"
      stringParts = endpointExpression.match(rMethodAndRoute);
      if (stringParts) {
        method = stringParts[1].toLowerCase() as HTTPMethod;
        route = _mountPath + stringParts[2];
      } else {
        // Fallback to parse as "/route"
        stringParts = endpointExpression.match(rRoute);
        if (stringParts) {
          route = _mountPath + stringParts[1];
        } else {
          // Fallback to parse as "METHOD"
          stringParts = endpointExpression.match(rMethod);
          if (stringParts) {
            route = _mountPath;
            method = stringParts[1].toLowerCase() as HTTPMethod;
          } else {
            throw new Error(`Unable to interpret "${endpointExpression}" as a valid expression`);
          }
        }
      }
    } catch (error) {
      throw new Error(`Unable to interpret "${endpointExpression}" as a valid expression`);
    }

    return { method, route };
  }
}

export default {
  Render: APIRenderRender
};