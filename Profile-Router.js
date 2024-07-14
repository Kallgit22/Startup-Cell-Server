const express = require("express");
const path = require("path");
const { uploadImage } = require("./uploadHandler");
const {
  uploadTestimonial,
  uploadSpeakerData,
  getTestimonials,
  getSpeakerList,
} = require("./Routes/GuestData");
const {
  register,
  login,
  updateProfile,
  getOTP,
  updateProfileImage,
  forgetPassword,
  deActivateAccount,
  activateAccount,
  deleteAccount,
  getUserData,
  logout,
} = require("./Routes/Accounts");
const { getRefreshToken, verifyAccessToken } = require("./Routes/JWT-Auth");
const router = express();

router.use(
  "/testimonial-image",
  express.static(path.join(__dirname + "/upload/testimonial-image"))
);
router.use(
  "/speaker-image",
  express.static(path.join(__dirname + "/upload/speaker-image"))
);

router.post(
  "/profile/upload-testimonial",
  uploadImage("testimonial-image"),
  uploadTestimonial
);
router.post(
  "/profile/upload-speaker",
  uploadImage("speaker-image"),
  uploadSpeakerData
);

router.get("/profile/get-testimonial", getTestimonials);
router.get("/profile/get-speaker", getSpeakerList);

router.post("/account/register-user", register);
router.post("/account/login-user", login);
router.post("/account/logout-user", verifyAccessToken, logout);
router.post("/account/get-user",verifyAccessToken, getUserData);
router.post("/account/update-profile", updateProfile);
router.post("/account/get-otp", getOTP);
router.post("/account/update-user-image",uploadImage("user-image"), updateProfileImage);
router.post("/account/forget-password", forgetPassword);
router.post("/account/deactivate-account", deActivateAccount);
router.post("/account/activate-account", activateAccount);
router.post("/account/delete-account", deleteAccount);
router.post("/account/get-refresh-token",getRefreshToken);

module.exports = router;
