import * as userModel from "../models/userModel.js";

const register = async (req, res) => {
  const registerData = { ...req.body };
  try {
    const { user, token } = await userModel.createUser(registerData);
    res.status(200).send({
      message: "User successfully added",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await userModel.loginUser(req.body);
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.header("Authorization", `Bearer ${result.token}`);
    res.json({ message: "Logged in successfully", user: result.user, token: result.token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userModel.updateUser(req.body);
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.json({ message: "User updated successfully", user: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userModel.deleteUser(req.body);
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.json({ message: "User deleted successfully", user: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const checkToken = (req, res) => {
  res.json({ valid: true });
};

export default {
  register,
  login,
  checkToken,
  updateUser,
  deleteUser,
};