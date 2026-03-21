import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";

const refreshTokenOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24,
};

const singup = async (req, res) => {
    try {
        const { username, email, password, salary } = req.body

        if (!username || !email || !password) {
            throw Error("All fildes are required !!");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw Error("User with this email already exist !!");
        }

        const newUser = await User.create({
            username,
            email,
            password,
            status: "active",
            role: "user",
            salary: salary,
        });

        if (!newUser) {
            throw Error("User can't be created !!")
        }

        return res.json({
            success: true,
            message: "User success fully registered.",
            data: newUser,
        })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while singup !!",
            data: []
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw Error("All fildes are required !!");
        }

        const user = await User.findOne({ email })

        if (!user) {
            throw Error("User doesn't exist with this email !!");
        }

        const refreshToken = await jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            })

        user.refreshToken = refreshToken;
        await user.save();

        return res
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                success: true,
                message: "User success fully registered.",
                data: user,
            })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while login !!",
            data: []
        })
    }
}


const getAllUsers = async (req, res) => {
    try {
        let token = req.cookies?.accessToken;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw Error("Session expired. Please login again.");
        }
        const user = await User.findById(decoded._id);

        if (user.role === "user") {
            throw Error("User isn't allowed to access")
        }

        const Users = await User();

        return res.json({
            success: true,
            message: "Successfully get all users.",
            data: Users,
        })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while getting all users !!",
            data: []
        })
    }
}

const updateUser = async (req, res) => {
    try {
        let token = req.cookies?.accessToken;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw Error("Session expired. Please login again.");
        }
        const user = await User.findById(decoded._id);

        if (user.role === "user") {
            throw Error("User isn't allowed to access")
        }

        const { username, salary } = req.body

        if (!username || !salary) {
            throw Error("All fildes are required !!");
        }

        user.username = username
        user.salary = salary
        await user.save();

        return res.json({
            success: true,
            message: "User successfully updated.",
            data: user,
        })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while updating users !!",
            data: user
        })
    }
}

const searchUser = async (req, res) => {
    try {
        const username = req.query.username;
        
        if(!username) {
            throw Error("Username is required for searching !!")
        }

        const users = await User({username});

        return res.json({
            success: true,
            message: "User successfully get.",
            data: users,
        })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while searching users !!",
            data: user
        })   
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.query.params;

        if(!id) {
            throw Error("Id is required for delting user.")
        }

        await User.deleteOne(id);

        return res.json({
            success: true,
            message: "User successfully deleted.",
            data: [],
        })

    } catch (err) {
        res.json({
            success: false,
            message: err?.message || "Somethign went wrong while deleting user !!",
            data: user
        })   
    }
}

export {
    singup,
    login,
    getAllUsers,
    updateUser,
    searchUser,
    deleteUser
}