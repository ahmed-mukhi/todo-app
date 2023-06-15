const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedDate: {
        type: Date,
        required: true
    },
    tags: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("todos", todoSchema);