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
        render(oAPIEndpoints, sPath) {
            for (let sEndpointKey in oAPIEndpoints) {
                const oEndpointValue = oAPIEndpoints[sEndpointKey];
                if (typeof oEndpointValue === "function") {
                    const oEndpoint = this._parseAPIEndpointKey(sEndpointKey, sPath);
                    debug(`${oEndpoint.method.toUpperCase()} ${oEndpoint.route} FN ${oEndpointValue.toString()}`);
                    this._router[oEndpoint.method].call(this._router, oEndpoint.route, oEndpointValue);
                } else if (typeof oEndpointValue === "object") {
                    let _sPath = sPath ? sPath.trim() + sEndpointKey.trim() : sEndpointKey.trim();
                    debug(`ROUTE ${_sPath} (RECURSIVE)`);
                    this.render(oEndpointValue, _sPath);
                } else if (typeof oEndpointValue === "string") {
                    const oEndpoint = this._parseAPIEndpointKey(sEndpointKey, sPath);
                    debug(`${oEndpoint.method.toUpperCase()} ${oEndpoint.route} FIXED STRING ${oEndpointValue}`);
                    this._router[oEndpoint.method].call(this._router, oEndpoint.route, (req, res) => res.send(oEndpointValue));
                } else throw Error("Unexpected value for key in endpoint settings")
            }
            return this._router;
        }
        _parseAPIEndpointKey(sEndpointKey, sPath) {
            // const aStringParts = sEndpointKey.split(/\s+/).filter(sStr => sStr);
            let aStringParts;
            let method;
            let route;
            if (!sPath) {
                aStringParts = sEndpointKey.match(/([A-Z-]+)\s+(\/\S*)/i);
                if (!aStringParts) throw Error(`Unable to interpret "${sEndpointKey}" as a valid routing instruction`);
                route = aStringParts[2];
            } else {
                aStringParts = sEndpointKey.match(/([A-Z-]+)/i);
                if (!aStringParts) throw Error(`Unable to interpret "${sEndpointKey}" as a valid HTTP method`);
                route = sPath;
            }
            method = aStringParts[1].toLowerCase();
            if (!this._validateHttpMethod(method)) throw Error(`Invalid HTTP method ${method}`);
            return { method, route };
        }
        _validateHttpMethod(sMethod) {
            return [
                "all", "checkout", "copy", "delete", "get", "head", "lock", "merge", "mkactivity",
                "mkcol", "move", "m-search", "notify", "options", "patch", "post", "purge",
                "put", "report", "search", "subscribe", "trace", "unlock", "unsubscribe"
            ].includes(sMethod);
        }
    }
}