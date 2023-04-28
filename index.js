import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import UserRouter from "./routes/UserRoutes.js";
import ClientRouter from "./routes/ClientRoutes.js";
import FreelancerRouter from "./routes/FreelancerRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/clients", ClientRouter);
app.use("/api/v1/freelancers", FreelancerRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(process.env.PORT, () =>
      console.log(`Server started on http://localhost:${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
