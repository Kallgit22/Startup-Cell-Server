const mongoose = require('mongoose');
function MemberSchema() {
    const schema = new mongoose.Schema({
        Name: { type: String, required: true },
        RegistrationNumber:{type: String, required: true ,unique:true},
        PhoneNumber:{type: String, required: true },
        Email: { type: String, required: true , unique: true },
        Post: { type: String, required: true},
        Authority:{type: String, required: true},
        ProfileImg: { type: String, required: true },
        LinkedIn: { type: String, required: true },
        ApprovalStatus:{type:Boolean,required:true}
    });
    return schema;
}

module.exports = MemberSchema;