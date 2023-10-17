import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import limitter from "express-rate-limit";
const app = express();

const corsOptions = {
  exposedHeaders: ["X-Total-Count", "Authorization"],
};

//helmet config
app.use(
  helmet({
    hidePoweredBy: true,
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true, // solo para usuarios que usen Internet Explorer
  })
);

// TODO https SSL/TSL

// app.use(
//     helmet({
//     hsts: {
//         maxAge: 7776000,
//         preload:true
//     },
//     })
// );

//Deny of services

app.use(
  limitter({
    windowMs: 3600,
    limit: 750,
    message: {
      code: 429,
      message: "Toomany request",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors(corsOptions)); // Use the corsOptions here

//import routes
import pruebaRoute from "./routes/prueba.routes";
import usersRoute from "./routes/user.routes";
import ticketRoute from "./routes/tickets.routes";
import reportRoute from "./routes/report.routes";
import phoneRoute from "./routes/phone.routes";

// routes usage
app.use("/", pruebaRoute);
app.use("/user", usersRoute);
app.use("/ticket", ticketRoute);
app.use("/phone", phoneRoute);
app.use("/report", reportRoute);

export default app;
