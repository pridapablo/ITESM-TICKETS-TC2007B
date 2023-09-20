import express from "express";
const app = express();

app.use(express.json());

//import routes
import pruebaRoute from './routes/prueba.routes'

// routes usage
app.use('/',pruebaRoute);

export default app;