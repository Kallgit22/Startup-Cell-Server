//Import External Library
const express = require('express');
const dbOperation = require('./dbOperation');
const schema = require('./Schemas');
const multer = require('multer');
const server = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

//Middlewares
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());// Serve static files from the 'uploads' directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Configuration codes
dotenv.config();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profileImgs'); // Upload files to the uploads directory
    },
    filename: (req, file, cb) => {
        
        if (req.body.name!=null) {
            const fileExtension = req.body.fileExtension;
            const userName = req.body.name;
            cb(null, userName + "_" + Date.now() + '.' + fileExtension); 
        } else {
            const filenameWithoutExtension = path.parse(file.originalname).name;
            cb(null, filenameWithoutExtension + "_" + Date.now() + '.' + path.extname(file.originalname)); // Append the current timestamp with the file extension
        }
        
    }
});

// Multer upload configuration
const upload = multer({ storage: storage });

//Environment Variable Related codes.
const PORT = process.env.PORT || 4000;
const url = process.env.URL;
const dbName = process.env.DB_NAME;
let Token = process.env.TOKEN;
console.log(Token);
//Database Related Functions.
const database = new dbOperation(url, dbName);
database.connect();
database.createCollection('MembersData', schema());

// Server Blocks for Handle Requests.

//This Server Block Provide Approved Members
//This Server Block Provide Approved Members
server.post('/getMembers', async (req, res) => {
    try {
        const headdata = await database.getApprovedData("Head");
        const overallheaddata = await database.getApprovedData("OHead");
        const studentRepresentativedata = await database.getApprovedData("SR");
        if (headdata || overallheaddata || studentRepresentativedata) {
            return res.status(200).json({ status: "Success", HeadData: headdata, OverallHeadData: overallheaddata, SRData: studentRepresentativedata });
        } else {
            return res.status(200).json({ status: "Failed", message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

//This Server Block Provide Member List Which Applied but not Approved (This is for Admin Pannel Only)
server.post('/getMembersForApproval', async (req, res) => {
    try {
        if (req.body.AuthenticationToken === "StartupCell2012to2024") {
            const data = await database.getDataForApproval();
            if (data) {
                return res.status(200).json({ status: "Success", membersData: data });
            } else {
                return res.status(200).json({ status: "Failed", message: "Data not found" });
            }
        } else {
            return res.status(200).json({ status: "Access Denied", message: "Unauthorized Access" });
        }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

//This Server Block Handle Registration of Members for Approval
server.post('/RegisterMember', upload.single('profileImg'), async (req, res) => {
    try {
        const imgPath = req.file.path;
        const result = await database.insertData(req.body, imgPath);
        if (result) {
            return res.status(200).json({ status: "Success", message: "Response Submited, and Sent to approval" });
        } else {
            return res.status(200).json({ status: "Failed", message: "Registration Unsuccessful" });
        }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});


//This Server Block Handle Member Approval after Registration (This is for Admin Pannel Only)
server.post('/memberApproval', async (req, res) => {
    try {
        if (req.body.AuthenticationToken === Token) {
            const status = await database.approve(req.body.email);
            if (status) {
                return res.status(200).json({ status: "Success", message: "Member Approved" });
            } else {
                return res.status(200).json({ status: "Failed", message: "Approval Failed, It may already be approved" });
            }
        } else {
            return res.status(200).json({ status: "Access Denied", message: "Unauthorized Access" });
        }
    } catch (error) {
        return res.status(500).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.post('/adminLogin', (req, res) => {
    try {
        const status = (req.body.email === 'shivmouryacse@gmail.com') && (req.body.password === 'Kall@123');
        if (status) {
            return res.status(200).json({ status: "Success", message: "Login Successful" });
        } else {
            return res.status(200).json({ status: "Failed", message: "Invalid Username or Password" });
        }
    } catch (error) {
        return res.status(200).json({ status: "Failed", message: "Internal Server Error", Error: error });
    }
});

server.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
});