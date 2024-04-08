const express=require('express');
const server =express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./.env'});

const PORT = process.env.PORT || 4000;
const db_url = process.env.DB_URL;
console.log(db_url);
server.use(express.urlencoded({extended:true}));

mongoose.connect(db_url,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{console.log("Database Conneted");})
.catch(err=>console.log(`Error: ${err}`));



server.get('/MembersData',(req,res)=>{
    const {name, age} = req.query;
    console.log(`NAME: ${name} , AGE: ${age}`);
    res.send(data)
});

server.post('/RegisterMember',(req,res)=>{
    const {name, age} = req.body;
    console.log(`NAME: ${name} , AGE: ${age}`);
    res.send(data)
});


server.listen(PORT,()=>{
    console.log(`Server Listening on ${PORT}`);
});
