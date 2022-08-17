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
const debug = require("debug")("Render");

module.exports = {
    Render: class APIRenderRender {
        constructor(oConfig) {
            this._router = new express.Router(oConfig);
            return this;
        }
        render(oAPIEndpoints) {
            for (let sEndpointKey in oAPIEndpoints) {
                const oEndpoint = this._parseAPIEndpointKey(sEndpointKey);
                debug(`${oEndpoint.method} ${oEndpoint.route} ${oAPIEndpoints[sEndpointKey].toString()}`);
                this._router[oEndpoint.method].call(this._router, oEndpoint.route, oAPIEndpoints[sEndpointKey]);
            }
            return this._router;
        }
        _parseAPIEndpointKey(sEndpointKey) {
            // const aStringParts = sEndpointKey.split(/\s+/).filter(sStr => sStr);
            const aStringParts = sEndpointKey.match(/([A-Z-]+)\s+(\/\S*)/);
            if(!aStringParts) throw Error(`Unable to interpret "${sEndpointKey}" as a valid routing instruction`);
            const method = aStringParts[1].toLowerCase();
            if (!this._validateHttpMethod(method)) throw Error(`Invalid HTTP method ${method}`);
            const route = aStringParts[2];
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