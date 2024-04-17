const mongoose = require('mongoose');
function InitiativeSchema() {
    const schema = new mongoose.Schema({
        Title: String,
        Details: String,
        Image: String
    });
    return schema;
}

module.exports = InitiativeSchema;