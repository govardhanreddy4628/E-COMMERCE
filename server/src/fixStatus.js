import mongoose from "mongoose";

const MONGO_URI="mongodb+srv://govardhanreddy:123456go@classy-shop.qw73ng1.mongodb.net/?retryWrites=true&w=majority&appName=classy-shop"

async function runFix() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await mongoose?.connection?.db
      .collection("users")
      .updateMany(
        { status: { $in: ["active", "inactive"] } },
        [
          {
            $set: {
              status: { $toUpper: "$status" }
            }
          }
        ]
      );

    console.log("Modified documents:", result.modifiedCount);

    await mongoose.disconnect();
    console.log("Done! 👍");
  } catch (err) {
    console.error(err);
  }
}

runFix();
