import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import "../src/kafka/consumer";

const app = express();
const PORT = 3004;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
