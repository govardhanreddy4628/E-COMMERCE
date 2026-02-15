import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";


const MONGO_URI = process.env.MONGO_URI!;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL!;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD!;

async function seedSuperAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    const existing = await UserModel.findOne({
      email: SUPER_ADMIN_EMAIL,
    });

    if (existing) {
      console.log("SUPER-ADMIN already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

    await UserModel.create({
      fullName: "Super Admin",
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPER-ADMIN",
      isVerified: true,        // no OTP needed
      status: "ACTIVE",
      mfa: {
        enabled: false,
        verified: false,
        secret: null,
        backupCodes: [],
      },
    });

    console.log("✅ SUPER-ADMIN seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed SUPER-ADMIN", err);
    process.exit(1);
  }
}

seedSuperAdmin();
