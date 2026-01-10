const mongoose = require("mongoose");
const Admin = require("./models/Admin"); // make sure path is correct
const connectDB = require("./conn/connection"); // your DB connection file

const createAdmin = async () => {
  await connectDB();

  try {
    const existingAdmin = await Admin.findOne({ name: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const admin = new Admin({
      name: "admin",
      password: "admin00o#", // plain text for now, will hash later
      role: "admin",
    });

    await admin.save();
    console.log("Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
