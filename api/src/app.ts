import express from "express";
import  morgan from 'morgan';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

//import routes
import pruebaRoute from './routes/prueba.routes'
import usersRoute from './routes/user.routes'
import ticketRoute from './routes/tickets.routes'
// import phoneRoute from './routes/phone.routes'



// routes usage
app.use('/', pruebaRoute);
app.use('/user', usersRoute);
app.use('/ticket', ticketRoute);
// app.use('/phone', phoneRoute);


export default app;