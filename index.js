import express from "express";
import * as dotenv from "dotenv";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
//import cors from "cors";
import connectDB from "./mongodb/connect.js";
import AuthRouter from "./routes/AuthRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import ClientRouter from "./routes/ClientRoutes.js";
import FreelancerRouter from "./routes/FreelancerRoutes.js";
import PackageRouter from "./routes/PackageRoutes.js";
import ReviewRouter from "./routes/ReviewRoutes.js";
import PortfolioItemRouter from "./routes/PortfolioItemRoutes.js";
import HomeRouter from "./routes/HomeRoutes.js";
import DataRouter from "./routes/DataRoutes.js";

dotenv.config();
const { PORT, MONGODB_URI } = process.env;

const app = express();
app.use(helmet());
//app.use(cors());
app.use(express.json({ limit: "5mb" }));
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/clients", ClientRouter);
app.use("/api/v1/freelancers", FreelancerRouter);
app.use("/api/v1/packages", PackageRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/portfolio", PortfolioItemRouter);
app.use("/api/v1/home", HomeRouter);
app.use("/api/v1/data", DataRouter);


const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);
    httpServer.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
