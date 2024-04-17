//Import External Library
const express = require('express');
const dbOperation = require('./DBOperations');
const schema = require('./Schemas');
const multer = require('multer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 4000;
const mongoURI = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const server = express();
const database = new dbOperation(mongoURI,dbName);

//Middlewares
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());// Serve static files from the 'uploads' directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/initiative/'); // Files will be uploaded to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Rename uploaded files with timestamp
    }
  });
  const upload = multer({ storage: storage });
  
  
  database.connect();
  database.createCollection("Initiative",schema());

  server.post('/Initiative/uploadData',upload.single('image'),async (req,res)=>{
    try {
      const path = req.file ? req.file.path : null;
      const status = await database.insertData(req.body,path)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Blog Published Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Blog not Published" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.get('/Initiative/getData', async (req,res)=>{
    try {
      const data =await database.getData();
      if (data) {
        return res.status(200).json({ status: "Success", data:data });
      } else {
        return res.status(200).json({ status: "Failed" });
      }
    } catch (error) {
      return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.post('/Initiative/updateData',async (req,res)=>{
    try {
      const status = await database.updateData(req.body)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Initiative Updated Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Initiative not Updated" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});


server.post('/Initiative/deleteData',async (req,res)=>{
    try {
      const status = await database.deleteData(req.body.title)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Initiative Deleted Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Initiative not Deleted" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});


server.listen(port,()=>{console.log(`Server Running on PORT: ${port}`);});