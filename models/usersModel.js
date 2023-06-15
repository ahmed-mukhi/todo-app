const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    todos: [{ type: Schema.Types.ObjectId, ref: "todos" }],
    profileImage: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });


module.exports = mongoose.model("users", userSchema);
