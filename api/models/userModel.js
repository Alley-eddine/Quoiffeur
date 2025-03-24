import User from "../schema/userSchema.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    const token = generateAuthToken(newUser);
    return { user: newUser, token };
  } catch (error) {
    throw new Error(error.message);
  }
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

const updateUser = async (userData) => {
  try {
    const user = await User.findOneAndUpdate({ _id: userData._id }, userData, {
      new: true,
    });
    return user;
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}

const generateAuthToken = (user) => {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
  return token;
};

const deleteUser = async (userData) => {
  try {
    const user = await User.findOneAndDelete({ _id: userData._id });
    return user;
  }
  catch (error) {
    console.error(error);
    return { error: "Delete failed" };
  }
}

export { createUser, loginUser, generateAuthToken  , updateUser , deleteUser};
