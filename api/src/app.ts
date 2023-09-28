import express from "express";
import  morgan from 'morgan';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));



//import routes
import pruebaRoute from './routes/prueba.routes'
import usersRoute from './routes/user.routes'



// routes usage
app.use('/', pruebaRoute);
app.use('/user', usersRoute);

export default app;