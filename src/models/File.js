const mongoose = require('mongoose');

const File = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

File.virtual("url").get(function(){
    const url = process.env.HOST_URL || 'http://localhost:3000';
    return `${url}/files/${encodeURIComponent(this.path)}`;
});

File.virtual("ext").get(function(){
    const ext = this.title.split('.')[1];
    return ext;
});

module.exports = mongoose.model("File", File);