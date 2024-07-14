// This Server control all data like: Initiatives, Blogs, Notifications, Notice etc.

const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const server = express();
const dotenv = require("dotenv");
const Router = require("./Data-Router");
const DBHandler = require("./DatabseHandler/DBHandler");

dotenv.config();

server.use(parser.json());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = process.env.DATA_PORT || 21000;
const url = process.env.DB_URL || "";

const handler = new DBHandler();
handler.connect(url);

server.use("/api", Router);


server.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
