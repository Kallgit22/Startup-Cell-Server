//Import External Library
const express = require('express');
const dbOperation = require('./DBOperations');
const schema = require('./Schemas');
const multer = require('multer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { ifError } = require('assert');

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
    cb(null, 'uploads/blogs/'); // Files will be uploaded to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename uploaded files with timestamp
  }
});
const upload = multer({ storage: storage });


database.connect();
database.createCollection("Blogs",schema());


server.post('/uploadBlog',upload.single('image'),async (req,res)=>{
    try {
      const path = req.file ? req.file.path : null;
      const status = await database.insertBlog(req.body,path)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Blog Published Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Blog not Published" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.get('/getBlogs', async (req,res)=>{
    try {
      const blogs =await database.getBlog();
      console.log(blogs);
      if (blogs) {
        // Format the date part of each blog entry
    const formattedBlogs = blogs.map(blog => ({
      ...blog.toObject(), // Convert Mongoose document to plain JavaScript object
      Date: blog.Date.toISOString().split('T')[0] // Format date
    }));
        return res.status(200).json({ status: "Success", data:formattedBlogs });
      } else {
        return res.status(200).json({ status: "Failed" });
      }
    } catch (error) {
      return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.post('/updateBlog',upload.single('image'),async (req,res)=>{
    try {
      const status = await database.updateBlog(req.body)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Blog Updated Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Blog not Updated" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});


server.post('/deleteBlog',upload.single('image'),async (req,res)=>{
    try {
      const status = await database.deleteBlog(req.body.title)
      if (status) {
        return res.status(200).json({ status: "Success", message:"Blog Deleted Successfully" });
      } else {
        return res.status(200).json({ status: "Failed", message: "Blog not Deleted" });
      }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});


server.listen(port,()=>{console.log(`Server Running on PORT: ${port}`);});