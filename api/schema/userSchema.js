import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
});

// Hash password
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.joiValidate = (user) => {
  const schema = Joi.object({
    mail: Joi.string().email().required(),
    username: Joi.string().min(8).max(30).required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);
export default User;
