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
const express = require("express");
const debug = require("debug")("api-rendr:Render");

module.exports = {
    Render: class APIRenderRender {
        constructor(oConfig) {
            this._router = new express.Router(oConfig);
            return this;
        }
        render(oAPIEndpoints, sMountPath) {
            for (let sEndpointExpression in oAPIEndpoints) {
                const oEndpointValue = oAPIEndpoints[sEndpointExpression];
                const oEndpoint = this._parseEndpointExpression(sEndpointExpression, sMountPath);

                if (typeof oEndpointValue === "function") {
                    if (oEndpointValue.name === "serveStatic") {
                        // express.static
                        debug(`${sEndpointExpression} STATIC`);
                        this._router.use.call(this._router, sEndpointExpression, oEndpointValue);

                    } else {
                        // handler fn
                        debug(`${oEndpoint.method.toUpperCase()} ${oEndpoint.route} FN ${oEndpointValue.toString().substring(0, 40)}`);
                        this._router[oEndpoint.method].call(this._router, oEndpoint.route, oEndpointValue);
                    }

                } else if (Array.isArray(oEndpointValue)) {
                    // Array of handlers [fn()]
                    debug(`ROUTE ${oEndpoint.route} MULTI-HANDLERS (${oEndpointValue.length})`);
                    oEndpointValue.forEach(oHandler => {
                        if (typeof oHandler === "function") {
                            // handler fn
                            debug(`+ ${oEndpoint.method.toUpperCase()} ${oEndpoint.route} FN ${oHandler.toString().substring(0, 40)}`);
                            this._router[oEndpoint.method].call(this._router, oEndpoint.route, oHandler);
                        }
                    });

                } else if (typeof oEndpointValue === "object") {
                    // sub-route (recursive)
                    debug(`ROUTE ${oEndpoint.route} (RECURSIVE)`);
                    this.render(oEndpointValue, oEndpoint.route);

                } else if (typeof oEndpointValue === "string") {
                    // fixed string
                    debug(`${oEndpoint.method.toUpperCase()} ${oEndpoint.route} FIXED STRING ${oEndpointValue.substring(0, 40)}`);
                    this._router[oEndpoint.method].call(this._router, oEndpoint.route, (req, res) => res.send(oEndpointValue));

                } else throw Error("Unexpected value for key in endpoint settings")
            }
            return this._router;
        }
        _parseEndpointExpression(sEndpointExpression, sMountPath) {
            const rMethodAndRoute = /^\s*(all|checkout|copy|delete|get|head|lock|merge|mkactivity|mkcol|move|m-search|notify|options|patch|post|purge|put|report|search|subscribe|trace|unlock|unsubscribe)\s+(\/\S*)\s*$/i;
            const rMethod = /^\s*(all|checkout|copy|delete|get|head|lock|merge|mkactivity|mkcol|move|m-search|notify|options|patch|post|purge|put|report|search|subscribe|trace|unlock|unsubscribe)\s*$/i;
            const rRoute = /^\s*(\/\S*)\s*$/;
            const _sMountPath = (sMountPath || "").trim();

            let aStringParts;
            let method;
            let route;

            try {
                // Try to parse as "METHOD /route"
                aStringParts = sEndpointExpression.match(rMethodAndRoute);
                if (aStringParts) {
                    method = aStringParts[1].toLowerCase();
                    route = _sMountPath + aStringParts[2];
                } else {
                    // Fallback to parse as "/route"
                    aStringParts = sEndpointExpression.match(rRoute);
                    if (aStringParts) {
                        route = _sMountPath + aStringParts[1];
                    } else {
                        // Fallback to parse as "METHOD"
                        aStringParts = sEndpointExpression.match(rMethod);
                        if (aStringParts) {
                            route = _sMountPath;
                            method = aStringParts[1].toLowerCase();
                        } else {
                            throw Error(`Unable to interpret "${sEndpointExpression}" as a valid expression`);
                        }
                    }
                }
            } catch (error) {
                throw Error(`Unable to interpret "${sEndpointExpression}" as a valid expression`);
            }
            return { method, route };
        }
    }
}
