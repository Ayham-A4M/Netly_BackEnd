const { default: mongoose } = require("mongoose");
// for normal user
const userSchema = new mongoose.Schema({
    userName: { type: String, require: true, unique: true, }, //this is name of account 
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    avatar: { type: String },
    bio: { type: String },
    defaultCoverColor: { type: String, required: true },
    coverImage: { type: String },
    title: { type: String },
    location: { type: String },
    birthday: { type: String },
    followingCount: { type: Number, default: 0 },// who user following
    followersCount: { type: Number, default: 0 }, // that following the user
    links: [{ type: String }],
    tokenVersion: { type: Number, default: 0 }
});
const userModel = mongoose.model('user', userSchema, 'users');
module.exports = userModel;