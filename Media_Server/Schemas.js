const mongoose = require('mongoose');
function BlogSchema() {
    const schema = new mongoose.Schema({
        Title: String,
        Content: String,
        Summary: String,
        Author: String,
        Date: Date,
        ImagePath: String
    });
    return schema;
}

module.exports = BlogSchema;