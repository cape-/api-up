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
const app = require("express")();

app.use(new Render().render({
    "ALL /": (req, res) => res.send("Try endpoint /orders"),
    "/orders": {
        POST: (req, res) => res.send("/orders POST handler"),
        GET: (req, res) => res.send("/orders GET handler"),
        "/:ordId": {
            GET: (req, res) => res.send(`GET order ${req.params.ordId}`),
            "/items": {
                GET: (req, res) => res.send(`GET items of order ${req.params.ordId}`),
                "/detail": {
                    GET: "Not implemented yet!"
                }
            }
        }
    },
    "ALL /help": "This is the help to show..."
}));

app.listen(3000, () => console.log(`Try opening http://localhost:3000/orders/1234/items/detail`));