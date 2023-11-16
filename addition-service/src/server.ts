import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import "../src/kafka/consumer";

const mongoose = require("mongoose");

const app = express();
const PORT = 3005;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

const MONGO_URI =
  "mongodb+srv://niravjain98:173xCR9h2f3zXQj1@cluster0.ddynqox.mongodb.net/db?retryWrites=true&w=majority";

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
