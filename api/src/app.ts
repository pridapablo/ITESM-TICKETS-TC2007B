import express, { NextFunction, Request, Response } from "express";
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: '*',  // Permite cualquier origen. Cambia esto según tus necesidades.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Los métodos que deseas permitir
    allowedHeaders: ['Content-Type', 'Authorization']  // Los encabezados que deseas permitir
}));

//import routes
import pruebaRoute from './routes/prueba.routes'
import usersRoute from './routes/user.routes'
import ticketsRoute from './routes/tickets.routes'

// routes usage
app.use('/', pruebaRoute);
app.use('/user', usersRoute);
app.use('tickets', ticketsRoute);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: err.message });
});

export default app;
