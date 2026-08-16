import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
        },

        lastname: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        profileimage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;