const { InitiativeModel } = require("../Assets/Data-Server-Models");
const DBHandler = require("../DatabseHandler/DBHandler");
const path = require("path");

const handler = new DBHandler();

const uploadInitiatives = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "failed", message: "No file uploaded" });
    }

    const imagePath = `http://localhost:21000/initiatives-image/${path.basename(
      req.file.path
    )}`;

    const data = {
      title: req.body.title,
      details: req.body.details,
      image: imagePath,
    };

    const status = await handler.put(InitiativeModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Initiative data uploaded successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to upload Initiative data",
      });
    }
  } catch (error) {
    console.error("Error uploading Initiative data:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const getInitiatives = async (req, res) => {
  try {
    const data = await handler.get(InitiativeModel);

    if (data) {
      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch Initiative data",
      });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

module.exports = { uploadInitiatives, getInitiatives };
