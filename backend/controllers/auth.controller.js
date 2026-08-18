import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateToken from "../config/token.js";


export const signup = async (req,res) => {
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



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                profileimage: user.profileimage
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};