import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import placeRoutes from "./routes/placeRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", placeRoutes);

app.get("/", (req, res) => {
  res.send("PubCrawlr Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
