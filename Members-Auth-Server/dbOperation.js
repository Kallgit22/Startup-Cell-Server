const mongoose = require('mongoose');

class dbOperation{
    constructor(url,dbName){
        this.url= url;
        this.dbName = dbName;
        this.model = null;
    }

    connect() {
        const URI = this.url+"/"+this.dbName;
        console.log(URI);
        mongoose.connect(URI)
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("MongoDB connection error:", err));
    }

    disconnect(){
        mongoose.disconnect();
    }

    createCollection(collName,schema){
        this.model = mongoose.model(collName,schema);
    }

    async getOneData(email){
        try {
            const data = await this.model.findOne({ email: email });
            return data;
        } catch (error) {
            // Handle any errors
            console.error("Error retrieving member data:", error);
            return null;
        }
    }

    async getFilteredData(field,value){
        try {
            const data = await this.model.find({ [field]: value });
            return data;
        } catch (error) {
            // Handle any errors
            console.error("Error retrieving filtered data:", error);
            return null;
        }
    }

    async getApprovedData(value){
        try {
            const data = await this.model.find({ Authority: value,ApprovalStatus:true });
            return data;
        } catch (error) {
            // Handle any errors
            console.error("Error retrieving filtered data:", error);
            return null;
        }
    }

    async getData(){
        try {
            const data = await this.model.find({ApprovalStatus:true});
            return data;
        } catch (error) {
            // Handle any errors
            console.error("Error retrieving data:", error);
            return null;
        }
    }


    async getDataForApproval(){
        try {
            const data = await this.model.find({ApprovalStatus:false,Authority:'Head'});
            return data;
        } catch (error) {
            // Handle any errors
            console.error("Error retrieving data:", error);
            return null;
        }
    }
    async insertData(body,path) {
        try {
            const { name,registrationNumber,phoneNumber, email,post,linkedIn,authority } = body;
            const status = await this.model.create({
                Name: name,
                RegistrationNumber:registrationNumber,
                PhoneNumber:phoneNumber,
                Email: email,
                Post: post,
                Authority:authority,
                ProfileImg: path,
                LinkedIn: linkedIn,
                ApprovalStatus:false
            });
            console.log("Data inserted successfully:", status);
            return true; // Return true for successful insertion
        } catch (error) {
            console.error("Error inserting data:", error);
            return false; // Return false for unsuccessful insertion
        }
    }
    
    async updateData(){

    }

    async approve(email,authority) {
        try {
            const member = await this.model.findOne({ Email: email });

            if (!member) {
                throw new Error('Member not found');
            }
            member.ApprovalStatus = true;
            member.Authority = authority;

            const updatedMember = await member.save();
    
            console.log('Member approved:', updatedMember);
    
            return true; // Return true for successful approval
        } catch (error) {
            console.error('Error approving member:', error);
            return false; // Return false for unsuccessful approval
        }
    }
    
    async deleteData(email){
        try {
            const status = await this.model.deleteOne({email:email});
            if (status) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log("Error : ".error);
            return false
        }
    }
}

module.exports = dbOperation;