import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import "../src/kafka/consumer";
import { AppDataSource } from "./data-source";

const app = express();
const PORT = 3003;

app.use(bodyParser.json());

AppDataSource.initialize()
  .then(async () => {
    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));

  
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
