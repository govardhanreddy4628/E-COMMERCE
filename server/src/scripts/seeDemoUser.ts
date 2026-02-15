import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import UserModel from "../models/userModel.js";


const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = [
    {
      fullName: "Demo User",
      email: "userexplorer@gmail.com",
      password: hashedPassword,
      isVerified: true,
      role: "USER",
      status: "ACTIVE",
      avatar: "https://i.pravatar.cc/150?img=3",
      isDemo: true,
    },
    {
      fullName: "Demo Admin",
      email: "adminexplorer@gmail.com",
      password: hashedPassword,
      isVerified: true,
      role: "ADMIN",
      status: "ACTIVE",
      avatar: "https://i.pravatar.cc/150?img=5",
      isDemo: true,
    },
  ];

  for (const user of users) {
    const exists = await UserModel.findOne({ email: user.email });

    if (!exists) {
      await UserModel.create(user);
      console.log(`✅ Created: ${user.email}`);
    } else {
      console.log(`⚠️ Already exists: ${user.email}`);
    }
  }

  mongoose.disconnect();
};

seedUsers();





// isDemo property can be used to access denail in frontend for example: 

// if (user.isDemo) {
//   return res.status(403).json({
//     success: false,
//     message: "Demo account cannot be modified",
//   });
// }

// if (user.isDemo) {
//   throw new Error("Cannot delete demo account");
// }
