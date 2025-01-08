import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "./user.interface";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      maxlength: 10,
      minlength: 3,
      trim: true,
      unique: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    password: {
      select: 0,
      type: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
      lowercase: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isUserExist = async function (username) {
  return await this.findOne(
    { username },
    { username, name: 1, email: 1, password: 1, role: 1, phone: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword,
  savedPassword
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
