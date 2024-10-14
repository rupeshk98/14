import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnect.js";
import userChatsRoute from "./routes/userChat.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});
//
app.use("/api", userChatsRoute);
app.get("/", (req, res) => {
  res.send("<h1>server is up and running</h1>");
});
app.listen(port, () => {
  connectDB();
  console.log(`Server listening on port ${port}`);
});
