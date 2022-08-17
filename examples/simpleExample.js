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

const PORT = process.env.PORT || 3000;

const r = new Render();
const oAPIEndpoints = {
    "ALL  /": (req, res) => res.send("Try navigating to <code>/orders.</code>"),
    "POST /orders": (req, res) => res.send("This is the /orders POST handler responding."),
    "GET  /orders": (req, res) => res.send("This is the /orders GET handler responding."),
    "GET  /orders/:orderId": (req, res) => res.send("This is the /orders/:orderId GET handler responding."),
    "GET  /orders/:orderId/items": (req, res) => res.send("This is the /orders/:orderId/items GET handler responding."),
    "POST /orderItems": (req, res) => res.send("This is the /orderItems POST handler responding."),
    "GET  /orderItems": (req, res) => res.send("This is the /orderItems GET handler responding."),
    "GET  /orderItems/:orderId}": (req, res) => res.send("This is the /orderItems/:orderId GET handler responding."),
    "GET  /orderItems/:orderId/:orderItem": (req, res) => res.send("This is the /orderItems/:orderId/:orderItem GET handler responding."),
}

app.use(r.render(oAPIEndpoints));
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
