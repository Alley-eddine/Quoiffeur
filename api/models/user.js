import User from "../schema/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const createUser = (userData) => {
    const newUser = new User(userData);
    newUser.save();
};

const loginUser = async (userData) => {
    try {
        const mail = userData.mail;
        const password = userData.password;
        const user = await User.findOne({ mail });

        if (!user) {
        throw new Error("User not found");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        throw new Error("Password not matching");
        }

        const token = generateAuthToken(user);

        return { user, token };
    } catch (error) {
        console.error(error);
        return { error: "Login failed" };
    }
};

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id.toString()}, process.env.SECRET_KEY);
    return token;
}

export {
    createUser,
    loginUser,
    generateAuthToken
}
