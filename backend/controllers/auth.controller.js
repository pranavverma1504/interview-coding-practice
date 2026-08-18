import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateToken from "../config/token.js";


const signup = async (req,res) => {
    try {
        const { firstname, lastname, username, email, password, profileimage } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        let existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedpassword = bcrypt.hashSync(password, 10)

        const createdUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedpassword,
            profileimage
        })

        let token = generateToken(createdUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day

        })


        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                firstname: createdUser.firstname,
                lastname: createdUser.lastname,
                username: createdUser.username,
                email: createdUser.email,
                profileimage: createdUser.profileimage
            }
        })

        

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default signup;