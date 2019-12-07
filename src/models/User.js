const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    accessToken: {
        type: String,
        default: undefined
    },
    birthDate: {
        type: Date,
        required: true
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

UserSchema.virtual('avatar').get(function () {
    const size = 200;

    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=mp`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=mp`;
});

UserSchema.statics.comparePassword = function (candidatePassword, password) {
    const isMatch = bcrypt.compareSync(candidatePassword, password);
    return isMatch;
};

UserSchema.plugin(require('mongoose-bcrypt'), {
    rounds: 10
});

module.exports = mongoose.model("User", UserSchema);