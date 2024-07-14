const mongoose = require("mongoose");

const InitiativeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  image: { type: String, required: true },
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  authorName: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  blogDetails: { type: String, required: true },
});

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  pdfPath: { type: String, required: true },
});

const NotificationSchema = new mongoose.Schema({
  notification: { type: String, required: true },
});

const TestimonialSachema = new mongoose.Schema({
  name: { type: String, required: true },
  authority: { type: String, required: true },
  testimonial: { type: String, required: true },
  image: { type: String, required: true },
});

const SpeakerSachema = new mongoose.Schema({
  name: { type: String, required: true },
  authority: { type: String, required: true },
  image: { type: String, required: true },
});

const UserCredential = new mongoose.Schema({
  name: { type: String, required: true },
  login_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, required: true },
  login: { type: Boolean, required: true },
});

const UserData = new mongoose.Schema({
  contact: { type: String, required: true },
  profession: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  currentAddress: { type: String, required: true },
  image: { type: String, required: true },
});

const InitiativeModel = mongoose.model("Initiatives", InitiativeSchema);
const BlogModel = mongoose.model("Blog", BlogSchema);
const NoticeModel = mongoose.model("Notice", NoticeSchema);
const NotificationModel = mongoose.model("Notification", NotificationSchema);
const TestimonialModel = mongoose.model("Testimonial", TestimonialSachema);
const SpeakerModel = mongoose.model("SpeakerList", SpeakerSachema);
const UserCredentialModel = mongoose.model("UserCredential", UserCredential);
const UserDataModel = mongoose.model("UserData", UserData);

module.exports = {
  InitiativeModel,
  BlogModel,
  NoticeModel,
  NotificationModel,
  TestimonialModel,
  SpeakerModel,
  UserCredentialModel,
  UserDataModel,
};
