const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    id: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true },
    role: { type: String, require: true },

});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;