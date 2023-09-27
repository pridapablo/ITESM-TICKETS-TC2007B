import express from "express";
import  morgan from 'morgan';


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

//import routes
import pruebaRoute from './routes/prueba.routes'
import usersRoute from './routes/user.routes'
import ticketRoute from './routes/tickets.routes'
import phoneRoute from './routes/phone.routes'



// routes usage
app.use('/', pruebaRoute);
app.use('/user', usersRoute);
app.use('/ticket', ticketRoute);
app.use('/phone', phoneRoute);


export default app;