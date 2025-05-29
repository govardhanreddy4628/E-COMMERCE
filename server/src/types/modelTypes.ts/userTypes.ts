import mongoose, {Document} from "mongoose";

export default interface IUser extends Document {
  name: string,
  email: string;
  password: string;
  contact: Number,
  isVerified: boolean;
  verificationToken?: string;
  role: 'user' | 'admin';
  resetPasswordToken: string;
  profilePicture:string;
  lastLogin?: Date;
}