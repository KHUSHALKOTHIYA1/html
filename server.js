require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

//get register page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//get login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/submit", async (req, res) => {
  const { name, email, phonenumber, password } = req.body;

  const newContact = new Contact({
    name,
    email,
    phonenumber,
    password,
  });

  try {
    await newContact.save();
    res.send("✅ Data saved successfully!");
  } catch (err) {
    res.send("❌ Error saving data: " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Contact.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.password !== password) {
      return res.status(401).send("Incorrect password");
    }

    return res.status(201).json(user.name);
  } catch (err) {
    res.send("❌ Error saving data: " + err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});
