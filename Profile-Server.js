const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const server = express();
const dotenv = require('dotenv');
const Router = require('./Profile-Router');
const DBHandler = require("./DatabseHandler/DBHandler");

dotenv.config();

server.use(express.urlencoded({extended:true}));
server.use(parser.json());
server.use(cors());
server.use(express.json());

const port = process.env.PROFILE_PORT || 20000;
const url = process.env.DB_URL || "";

const handler = new DBHandler();
handler.connect(url);

server.use('/api', Router);

server.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });