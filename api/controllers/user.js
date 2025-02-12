import * as userModel from "../models/user.js";

const register = async (req, res) => {
    const registerData = { ...req.body };
    try {
        const newUser = await userModel.createUser(registerData);
        res.status(200).send({
            message: "User successfully added",
            data: newUser
        })
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

const login = async (req, res) => {
    try {
        const result = await userModel.loginUser(req.body);
        if(result.error) {
            return res.status(401).json({ error: result.error });
        }
        res.header("Authorization", `Bearer ${result.token}`);
        res.json({ message: "Logged in successfully", user: result.user});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

const checkToken = (req, res) => {
    res.json({ valid: true });
}

export {
    register, 
    login, 
    checkToken
}