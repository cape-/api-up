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

const { Render } = require("../main");
const express = require("express");
const app = express();

app.use(new Render().render({
    // Define a handler fn for a "{METHOD} {/route}"
    "GET /": (req, res) => res.send("Try endpoint /orders"),
    // Define a object for {/route}
    "/orders": {
        // Define a handler fn for a "{METHOD}"
        POST: (req, res) => res.send("/orders POST handler"),
        GET: (req, res) => res.send("/orders GET handler"),
        // Define a object for {/route/subroute}
        "/:ordId": {
            // Use mixed definitions
            GET: (req, res) => res.send(`GET order ${req.params.ordId}`),
            "GET /status": "DONE",
            "/items": {
                // Define an Array of handler fns
                GET: [
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - first handler...`); next(); },
                    (req, res, next) => { console.log(`GET items of order ${req.params.ordId} - second handler...`); next(); },
                    (req, res, next) => { res.send(`GET items of order ${req.params.ordId} - third and last handler.`) },
                ],
                "/detail": {
                    // Serve a simple response with a fixed string
                    GET: "Not implemented yet!"
                }
            }
        }
    },
    "ALL /help     ": "This is the help to show...",
    // Serve static resources
    "/resources": express.static(__dirname + "/static"),
}));

app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders/1234/items/detail`));