// - username – String,
// - email – String ( validate email if email is already registered or not)
// - password – String (password Must be encrypted)
// - confirm_password - String
// - status – Boolean Data types
// - created_date – String
// - updated_date – String

// - Name – String,
// - email - String
// - salary - String
// - designation - String
// - status – Boolean Data types
// - created_date – String
// - updated_date – String

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "pending"],
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            required: true,
        },
        refreshToken: {
            type: String,
        },

        // user specific fildes
        salary: {
            type: Number,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);