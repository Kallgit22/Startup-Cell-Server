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

    async insertBlog(body,path){
        try {
            const { title,content,summary,author,date } = body;
            const status = await this.model.create({
                Title: title,
                Content:content,
                Summary:summary,
                Author: author,
                Date: date,
                ImagePath:path
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

    async getBlog(){
        try {
            const data = await this.model.find();
            return data;
        } catch (error) {
            return null;
        }
    }

    async updateBlog(body){
        try {
            const blog = await this.model.findOne({ Title: body.title});

            if (!blog) {
                throw new Error('Blog not found');
            }
            blog.Title = body.title;
            blog.Content = body.content;
            blog.Summary = body.summary;
            blog.Content = body.content;
            blog.Author = body.author;
            blog.Date = body.date;

            const updatedBlog = await blog.save();

            if (updatedBlog) {
                return true; // Return true for successful approval
            } else {
                return false;
            }

        } catch (error) {
            return false; // Return false for unsuccessful approval
        }
    }

    async deleteBlog(title){
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