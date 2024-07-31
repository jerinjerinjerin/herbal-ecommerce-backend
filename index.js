import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDb from "./config/db.js";
import userRoute from "./routes/user.route.js";
import productRoute from './routes/product.route.js'
import ReviewRoute from './routes/productreview.route.js'
import addToCart from './routes/addToCart.route.js'

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", userRoute);
app.use('/api', productRoute);
app.use('/api', ReviewRoute);
app.use('/api', addToCart);

const PORT = process.env.PORT || 8080;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

app.get("/", (req, res) => {
  res.send("Hello, ShopApp Server!");
});
