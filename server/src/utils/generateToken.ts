import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';

export const generateAccessToken = (id: string, role: string) =>{
  const token = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1h' });
  return token;
}

export const generateRefreshToken = async(id: string) =>{
  const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  await UserModel.updateOne({id : id}, {refresh_token : token});
  
  return token;
}
