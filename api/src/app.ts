import express from "express";
import  morgan from 'morgan';


const app = express();
app.use(express.json());
app.use(morgan('dev'));



//import routes
import pruebaRoute from './routes/prueba.routes'


// routes usage
app.use('/',pruebaRoute);

export default app;