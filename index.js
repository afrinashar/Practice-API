const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.hbkqtqv.mongodb.net/practice`;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Mongoose Schema and Model
const linkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
});

const Link = mongoose.model("Link", linkSchema);

const todaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
});

const Today = mongoose.model("Today", todaySchema);

// Routes
app.get("/api/links", async (req, res) => {
  try {
    const links = await Link.find();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: "Error fetching links", error });
  }
});

app.get("/api/today", async (req, res) => {
  try {
    const today = await Today.find();
    res.status(200).json(today);
  } catch (error) {
    res.status(500).json({ message: "Error fetching today entries", error });
  }
});
app.post("/api/links", async (req, res) => {
  const { name, title, description, type, date } = req.body;

  try {
    const newLink = new Link({ name, title, description, type, date });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: "Error creating link", error });
  }
});

app.post("/api/today", async (req, res) => {
  const { name,  description,   date } = req.body;

  try {
    const newLink = new Today({ name,   description,   date });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: "Error creating link", error });
  }
});

app.put("/api/links/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, description, type, date } = req.body;

  try {
    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { name, title, description, type, date },
      { new: true }
    );
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: "Error updating link", error });
  }
});
app.put("/api/today/:id", async (req, res) => {
  const { id } = req.params;
  const { name,   description,  date } = req.body;

  try {
    const updatedLink = await Today.findByIdAndUpdate(
      id,
      { name,   description,   date },
      { new: true }
    );
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: "Error updating link", error });
  }
});
app.delete('/api/links/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Link.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: "Link not found" });
      }
      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.delete('/api/today/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Today.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: "Link not found" });
      }
      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
