const mongoose = require('mongoose');

class DBOperations {
    constructor(url,dbName){
        this.url= url;
        this.dbName = dbName;
        this.model = null;
    }

    connect(){
        const URI = this.url+"/"+this.dbName;
        console.log(URI);
        mongoose.connect(URI)
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("MongoDB connection error:", err));
    }

    createCollection(collName,schema){
        this.model = mongoose.model(collName,schema);
    }

    async insertData(body,path){
        try {
            const { title,details } = body;
            const status = await this.model.create({
                Title: title,
                Details:details,
                Image:path
            });
            
            if (status) {
                return true; // Return true for successful insertion
            } else {
                return false;
            }
            
        } catch (error) {
           
            return false; // Return false for unsuccessful insertion
        }
    }

    async getData(){
        try {
            const data = await this.model.find();
            return data;
        } catch (error) {
            return null;
        }
    }

    async updateData(body){
        try {
            const data = await this.model.findOne({ Title: body.title});

            if (!data) {
                throw new Error('Initiative not found');
            }
            data.Title = body.title;
            data.Details = body.details;

            const updated = await data.save();

            if (updated) {
                return true; // Return true for successful approval
            } else {
                return false;
            }

        } catch (error) {
            return false; // Return false for unsuccessful approval
        }
    }

    async deleteData(title){
        try {
            const status = await this.model.deleteOne({Title:title});
            if (status) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
}

module.exports = DBOperations;