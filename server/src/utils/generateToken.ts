import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';

const ACCESS_EXPIRES = "15m";
export const REFRESH_EXPIRES_SEC = 7 * 24 * 60 * 60; // or 7 days in seconds

export const generateAccessToken = (id: string, role: string) =>{
  const token = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: ACCESS_EXPIRES });
  return token;
}

export const generateRefreshToken = async(id: string) =>{
  const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: `${REFRESH_EXPIRES_SEC}s` });        //or u can direcly use {expiresIn: "7d"}

  await UserModel.updateOne({id : id}, {refresh_token : token});
  
  return token;
}
