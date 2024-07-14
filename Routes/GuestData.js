const {
  TestimonialModel,
  SpeakerModel,
} = require("../Assets/Data-Server-Models");
const DBHandler = require("../DatabseHandler/DBHandler");
const path = require("path");

const handler = new DBHandler();

const uploadTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "failed", message: "No file uploaded" });
    }

    const imagePath = `http://localhost:20000/api/testimonial-image/${path.basename(
      req.file.path
    )}`;

    const data = {
      name: req.body.name,
      authority: req.body.authority,
      testimonial: req.body.testimonial,
      image: imagePath,
    };

    const status = await handler.put(TestimonialModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Testimonial uploaded successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to upload Testimonial",
      });
    }
  } catch (error) {
    console.error("Error uploading Testimonial:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};
const getTestimonials = async (req, res) => {
  try {
    const data = await handler.get(TestimonialModel);

    if (data) {
      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch Testimonial",
      });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const uploadSpeakerData = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "failed", message: "No file uploaded" });
    }

    const imagePath = `http://localhost:20000/api/speaker-image/${path.basename(
      req.file.path
    )}`;

    const data = {
      name: req.body.name,
      authority: req.body.authority,
      image: imagePath,
    };

    const status = await handler.put(SpeakerModel, data);

    if (status) {
      return res.status(200).json({
        status: "success",
        message: "Speaker data uploaded successfully",
        details: status,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to upload Speaker data",
      });
    }
  } catch (error) {
    console.error("Error uploading Speaker data:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};
const getSpeakerList = async (req, res) => {
  try {
    const data = await handler.get(SpeakerModel);

    if (data) {
      return res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: "Failed to fetch Speaker List",
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
  uploadTestimonial,
  uploadSpeakerData,
  getTestimonials,
  getSpeakerList,
};
