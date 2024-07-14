const express = require("express");
const path = require("path");
const { uploadInitiatives, getInitiatives } = require("./Routes/Initiatives.js");
const { uploadImage, uploadPDF } = require("./uploadHandler.js");
const { uploadBlog, getBlog } = require("./Routes/Blogs.js");
const { uploadNotice, getNotice, uploadNotification, getNotification } = require("./Routes/Notice.js");

const router = express();

router.use('/initiatives-image',express.static(path.join(__dirname + "/upload/initiatives-image")));
router.use('/blog-image',express.static(path.join(__dirname + "/upload/blog-image")));
router.use('/gallery-image',express.static(path.join(__dirname + "/upload/gallery-image")));

router.post('/data/upload-initiative',uploadImage("initiatives-image"),uploadInitiatives);
router.get('/data/get-initiative',getInitiatives);

router.post('/data/upload-blog',uploadImage("blog-image"),uploadBlog);
router.get('/data/get-blog',getBlog);

router.post('/data/upload-notice',uploadPDF(),uploadNotice);
router.get('/data/get-notice',getNotice);
router.post('/data/upload-notification',uploadNotification);
router.get('/data/get-notification',getNotification);


module.exports = router;