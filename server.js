require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  const newContact = new Contact.insertOne({
    name,
    email,
  });

  try {
    await newContact.save();
    res.send("✅ Data saved successfully!");
  } catch (err) {
    res.send("❌ Error saving data: " + err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});
