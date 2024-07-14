const {
  NoticeModel,
  NotificationModel,
} = require("../Assets/Data-Server-Models");
const DBHandler = require("../DatabseHandler/DBHandler");
const fs = require("fs").promises;
const path = require("path");

const handler = new DBHandler();

const uploadNotice = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "failed", message: "No file uploaded" });
    }

    const pdfPath = req.file.path;

    const data = {
      title: req.body.title,
      details: req.body.details,
      pdfPath: pdfPath,
    };

    const status = await handler.put(NoticeModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Notice uploaded successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to upload Notice",
      });
    }
  } catch (error) {
    console.error("Error uploading notice:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const getNotice = async (req, res) => {
  try {
    const data = await handler.get(NoticeModel);

    if (!data) {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch notice",
      });
    }

    // Read and convert PDF to Base64 for each notice
    const noticesWithPdf = await Promise.all(
      data.map(async (notice) => {
        try {
          const pdfData = await fs.readFile(notice.pdfPath);
          const pdfBase64 = `data:application/pdf;base64,${pdfData.toString("base64")}`;
          return { ...notice._doc, pdfBase64 };
        } catch (error) {
          console.error("Error reading PDF file:", error);
          return { ...notice._doc, pdfBase64: null };
        }
      })
    );

    return res.status(200).json({
      status: "success",
      data: noticesWithPdf,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const uploadNotification = async (req, res) => {
  try {
    const data = {
        notification: req.body.details,
    };

    const status = await handler.put(NotificationModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Notification send successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to send notification",
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const getNotification = async (req, res) => {
  try {
    const data = await handler.get(NotificationModel);

    if (data) {
      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch notification",
      });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

module.exports = {
  uploadNotice,
  uploadNotification,
  getNotice,
  getNotification,
};
