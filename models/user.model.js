const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        require: true,
        unique: true,
        trim: true,//deletes white space
        minlength: 3,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
        minlength: 6,
    },
},{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;