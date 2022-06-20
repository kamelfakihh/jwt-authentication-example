const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true        
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type: String,
        required : true        
    }
});


userSchema.pre('save', async function(next) {
    const hash = await bcryptjs.hash(this.password, 10);        
    this.password = hash;
    next();
});

userSchema.methods.validatePassword = async function(password){
    const comparison = await bcryptjs.compare(password, this.password);
    return comparison;
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;