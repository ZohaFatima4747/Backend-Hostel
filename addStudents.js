const mongoose = require("mongoose");
const Student = require("./models/Student"); // Student model
const connectDB = require("./conn/connection"); // MongoDB connect

// Student data
const students = [
   { "name": "Zoha", "SecurityFee":"4k", "roomNo": "01", "password": "Zoha001" }, 
  { "name": "Kainat", "SecurityFee":"4k", "roomNo": "01", "password": "Kainat001" }, 
  { "name": "Asma","SecurityFee":"4k", "roomNo": "01", "password": "Asma001#" },
  { "name": "Tayyba","SecurityFee":"6k", "roomNo": "01", "password": "Tayyba#001" }, 
  { "name": "Sadia","SecurityFee":"Null", "roomNo": "01", "password": "Sadia01" }, 
  { "name": "Hadia","SecurityFee":"6k", "roomNo": "02", "password": "Hadia#002" }, 
  { "name": "Romesa","SecurityFee":"Null", "roomNo": "03", "password": "Romesa#003" },
   { "name": "Nimra","SecurityFee":"5K", "roomNo": "03", "password": "Nimra#003" },
  { "name": "Shumaila","SecurityFee":"6k", "roomNo": "05", "password": "Shumaila#005" }, 
  { "name": "Amber","SecurityFee":"Null", "roomNo": "05", "password": "Amber#005" }, 
  { "name": "Amaria","SecurityFee":"6k", "roomNo": "05", "password": "Amaria005#" }, 
  { "name": "Ayesha","SecurityFee":"Null", "roomNo": "06", "password": "Ayesha#006" }, 
  { "name": "Ansa","SecurityFee":"6k", "roomNo": "06", "password": "Ansa#006" }, 
  { "name": "Sobia","SecurityFee":"6k", "roomNo": "07", "password": "Sobia#007" } 
];

// Connect to MongoDB and insert students
const addStudents = async () => {
  try {
    await connectDB();

    for (let student of students) {
      // check if student already exists
      const exists = await Student.findOne({ name: student.name, roomNo: student.roomNo });
      if (!exists) {
        const newStudent = new Student(student);
        await newStudent.save();
        console.log(`Added: ${student.name}`);
      } else {
        console.log(`Already exists: ${student.name}`);
      }
    }

    console.log("All students processed.");
    process.exit(0); // exit after completion
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addStudents();
