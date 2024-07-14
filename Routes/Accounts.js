const {
  UserCredentialModel,
  UserDataModel,
} = require("../Assets/Data-Server-Models");
const DBHandler = require("../DatabseHandler/DBHandler");
const path = require("path");
const bcrypt = require("bcrypt");
const { randomInt } = require("crypto");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../Assets/MailSender");

// Set up Global configuration access
dotenv.config();
const handler = new DBHandler();
const REFRESH_TOKEN_EXPIRY = "5d";
const ACCESS_TOKEN_EXPIRY = "1h";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET_KEY;

const generateOTP = () => {
  // Generate a random 6-digit OTP
  return randomInt(100000, 999999).toString();
};

const generateRandomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(randomInt(0, chars.length));
  }
  return password;
};

const generateNumericId = () => {
  return `15${randomInt(100000, 999999).toString()}`; // Generates a 6-digit numeric ID
};

const generateAccessToken = (_id) => {
  return jwt.sign({ _id }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (_id) => {
  return jwt.sign({ _id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const register = async (req, res) => {
  const { name, email } = req.body;
  try {
    let id, password, hashedPassword, existingUserWithId;

    do {
      id = generateNumericId();
      // Check if ID exists in database
      existingUserWithId = await handler.getUserById(UserCredentialModel, id);
    } while (!existingUserWithId);

    const emailCheck = await handler.getUserByEmail(UserCredentialModel, email);
    if (emailCheck) {
      return res.status(409).json({
        message: `Email already registered`,
      });
    }
    password = generateRandomPassword();
    hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      login_id: id,
      password: hashedPassword,
      email,
      active: true,
    };
    console.log(newUser);
    const status = await handler.put(UserCredentialModel, newUser);
    console.log("Working");
    if (status) {
      const emailSubject = "Your Account Details";
      const emailText = `Hello ${name},\n\nYour account has been created successfully.\n\nID: ${id}\nPassword: ${password}\n\nPlease change your password after logging in.`;

      const emailStatus = await sendEmail(email, emailSubject, emailText);
      if (emailStatus) {
        return res.status(201).json({
          message:
            "User registered successfully. Credentials sent to the provided email.",
        });
      } else {
        return res.status(201).json({
          message: `User registered successfully. Credentials have not been sent to the provided email. Please contact the support team with this login ID: ${id}`,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to register user" });
  }
};

const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await handler.getUserById(UserCredentialModel, id);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate access token
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      // Respond with success message, access token, and user data
      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" });
  }
};

const logout = async (req, res) => {
  try {
    const id = req.user;
    const { ...updateData } = req.body;
    const updatedUser = await handler.update(UserCredentialModel, id, updateData);
    return res
      .status(200)
      .json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to logout" });
  }
};

const getUserData = async (req, res) => {
  try {
    const id = req.user;
    const UserCredential = await handler.getById(UserCredentialModel, id);
    const userData = {
      id: UserCredential.login_id,
      name: UserCredential.name,
      email: UserCredential.email,
      active: UserCredential.active,
    };

    // Respond with success message, access token, and user data
    return res.status(200).json({
      userData: userData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const forgetPassword = async (req, res) => {
  // Logic for handling forgot password
};

const getOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(); // Generate OTP
    const emailSubject = "OTP for Verification";
    const emailText = `Your OTP is: ${otp}`;

    // Send OTP via email
    await sendEmail(email, emailSubject, emailText);

    return res.status(200).json({ message: "OTP sent successfully", otp: otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedUser = await handler.update(UserDataModel, id, updateData);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.body;
    const imagePath = path.join("/uploads/user-images", req.file.filename);
    const updatedUser = await handler.update(UserDataModel, id, {
      image: imagePath,
    });
    return res
      .status(200)
      .json({ message: "Profile image updated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile image" });
  }
};

const deActivateAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const updatedUser = await handler.update(UserCredentialModel, id, {
      active: false,
    });
    return res
      .status(200)
      .json({ message: "Account deactivated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to deactivate account" });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { id } = req.body;
    const updatedUser = await handler.update(UserCredentialModel, id, {
      active: true,
    });
    return res
      .status(200)
      .json({ message: "Account activated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to activate account" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.body;
    await handler.delete(UserCredentialModel, id);
    await handler.delete(UserDataModel, id);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete account" });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgetPassword,
  getOTP,
  updateProfile,
  updateProfileImage,
  deActivateAccount,
  activateAccount,
  deleteAccount,
  getUserData,
};
