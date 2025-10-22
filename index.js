import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import router from "./route.js";
import cors from "cors";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
