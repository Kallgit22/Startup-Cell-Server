const { BlogModel } = require("../Assets/Data-Server-Models");
const DBHandler = require("../DatabseHandler/DBHandler");
const path = require("path");

const handler = new DBHandler();

const uploadBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "failed", message: "No file uploaded" });
    }

    const imagePath = `http://localhost:21000/blog-image/${path.basename(
      req.file.path
    )}`;

    const data = {
        title: req.body.title,
        image: imagePath,
        authorName: req.body.author,
        publishDate: Date.now(),
        blogDetails: req.body.details,
    };

    const status = await handler.put(BlogModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Blog uploaded successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to upload Blog",
      });
    }
  } catch (error) {
    console.error("Error uploading blog:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const getBlog = async (req, res) => {
  try {
    const data = await handler.get(BlogModel);

    if (data) {
      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch blog",
      });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

module.exports = { uploadBlog, getBlog };
